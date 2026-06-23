import { InputComponent } from "./components/InputComponent";
import { EntityManager } from "./ecs/EntityManager";
import { System } from "./ecs/System";
import { spawnTank } from "./factories/TankFactory";
import { MovementSystem } from "./systems/MovementSystem";
import { RenderSystem } from "./systems/RenderSystem";
import { Viewport } from "pixi-viewport";
import { Engine } from "matter-js";
import { engine } from "./physics/engine";
import { TurretAimingSystem } from "./systems/TurretAimSystem";
import { ShootingSystem } from "./systems/ShootingSystem";
import { HealthSystem } from "./systems/HealthSystem";
import { HealthBarSystem } from "./systems/HealthBarSystem";
import { CollisionSystem } from "./systems/CollisionSystem";
import { AISystem } from "./systems/AISystem";
import { createWorld } from "./physics/createWorld";
import { gameEvents } from "./GameEvents";
import { WanderingSystem } from "./systems/WanderingSystem";
import { BulletLifetimeSystem } from "./systems/BulletLifetimeSystem";
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  NEST_CENTER,
  NEST_PULSE_INTERVAL_MS,
  NEST_PULSE_COUNT,
} from "./data/world";
import { pickSpawnPoint } from "./utils/pickSpawnPoint";
import { GameMode, GameModeId } from "./modes/GameMode";
import { ffaMode } from "./modes/ffa";
import { survivalMode } from "./modes/survival";
import { teamMode } from "./modes/team";
import { spawnNest } from "./utils/spawnNest";
import { spawnObstacles } from "./utils/arenaSpawner";
import { emitHudUpdate, emitScoreboard } from "./utils/scoring";
import { applyStatSideEffects } from "./utils/statAllocation";
import { ParticleSystem } from "./systems/ParticleSystem";
import type { UpgradeableStat } from "./data/stat-allocation";
import type { TankClassId } from "./data/tank-classes";
import { applyClassEvolution } from "./utils/classEvolution";

const MODES: Record<GameModeId, GameMode> = {
  ffa: ffaMode,
  survival: survivalMode,
  team: teamMode,
};

export class GameWorld {
  private entityManager = new EntityManager();
  private systems: System[] = [];
  private collisionSystem: CollisionSystem;
  private particleSystem: ParticleSystem;
  private mode: GameMode;
  private playerDeadEmitted = false;
  private nestPulseTimer = 0;
  private hudTick = 0;
  private minimapTick = 0;

  constructor(
    private viewport: Viewport,
    modeId: GameModeId = "ffa",
    private playerName = "Player"
  ) {
    this.mode = MODES[modeId] ?? ffaMode;
    viewport.drag().decelerate();
    createWorld(viewport, WORLD_WIDTH, WORLD_HEIGHT);
    spawnObstacles(this.entityManager, viewport);
    spawnNest(
      this.entityManager,
      viewport,
      NEST_CENTER.x,
      NEST_CENTER.y,
      8
    );

    this.collisionSystem = new CollisionSystem(this.entityManager);
    this.particleSystem = new ParticleSystem(this.viewport);

    this.systems.push(
      new MovementSystem(),
      new HealthSystem(this.viewport),
      new HealthBarSystem(),
      new RenderSystem(this.viewport),
      new TurretAimingSystem(this.viewport),
      new ShootingSystem(this.viewport),
      this.collisionSystem,
      new AISystem(this.viewport),
      new WanderingSystem(),
      new BulletLifetimeSystem(),
      this.particleSystem
    );
  }

  destroy() {
    this.collisionSystem.destroy();
    this.particleSystem.destroy();
  }

  init() {
    this.mode.onInit(this);
    emitScoreboard(this.entityManager);
  }

  spawnPlayer(teamId = "player", name?: string) {
    const existing = this.entityManager.getEntity("player");
    if (existing) return existing;

    const { x, y } = pickSpawnPoint(this.entityManager, "playerStart", {
      minDist: 80,
    });
    const tank = spawnTank({
      id: "player",
      em: this.entityManager,
      viewport: this.viewport,
      x,
      y,
      teamId,
      displayName: name ?? this.playerName,
      statsKey: "DEFAULT",
      options: { color: 0x00ff00 },
    });
    tank.addComponent("Input", new InputComponent());
    this.playerDeadEmitted = false;
    return tank;
  }

  respawnPlayer() {
    const dead = this.entityManager.getEntity("player");
    if (dead) {
      // already removed by health system
    }
    if (!this.mode.shouldRespawnPlayer()) return null;
    return this.spawnPlayer(
      this.mode.id === "team" ? "ally" : "player",
      this.playerName
    );
  }

  adjustPlayerStat(stat: UpgradeableStat, delta: 1 | -1): boolean {
    const player = this.entityManager.getEntity("player");
    if (!player) return false;

    const stats = player.getComponent("Stats");
    const progression = player.getComponent("Progression");
    if (!stats || !progression) return false;

    if (delta === 1) {
      const unspent = progression.unspentStatPoints(stats.getTotalAllocated());
      if (unspent <= 0) return false;
    } else if (stats.getAllocation(stat) <= 0) {
      return false;
    }

    if (!stats.adjustAllocation(stat, delta)) return false;

    applyStatSideEffects(player, stat, delta);
    emitHudUpdate(this.entityManager);
    return true;
  }

  applyPlayerClassEvolution(classId: TankClassId) {
    const player = this.entityManager.getEntity("player");
    if (!player) return;
    applyClassEvolution(player, classId, this.viewport);
    const progression = player.getComponent("Progression");
    if (progression) {
      progression.pendingClassEvolution = false;
      progression.classEvolutionChoices = [];
    }
    gameEvents.emit("combatFx", {
      type: "evolve",
      x: player.getComponent("PhysicsBody")!.body.position.x,
      y: player.getComponent("PhysicsBody")!.body.position.y,
      color: player.getComponent("Stats")?.getStats().color,
      sourceId: "player",
    });
    emitHudUpdate(this.entityManager);
  }

  update(delta: number) {
    Engine.update(engine, delta);
    for (const system of this.systems) {
      system.update(this.entityManager, delta);
    }

    this.mode.onUpdate(this, delta);

    this.nestPulseTimer += delta;
    if (this.nestPulseTimer >= NEST_PULSE_INTERVAL_MS) {
      this.nestPulseTimer = 0;
      spawnNest(
        this.entityManager,
        this.viewport,
        NEST_CENTER.x,
        NEST_CENTER.y,
        NEST_PULSE_COUNT
      );
    }

    const tank = this.entityManager.getEntity("player");

    if (tank) {
      const physicsBody = tank.getComponent("PhysicsBody");
      const health = tank.getComponent("Health");
      const progression = tank.getComponent("Progression");

      if (health && health.isDead() && !this.playerDeadEmitted) {
        this.playerDeadEmitted = true;
        const killerId = health.lastAttackerId;
        const killer = killerId
          ? this.entityManager.getEntity(killerId)
          : undefined;
        gameEvents.emit("playerDied", {
          killerName: killer?.getComponent("Name")?.name,
          survivalTime: Math.floor(
            (performance.now() - (progression?.spawnTime ?? 0)) / 1000
          ),
          xpEarned: progression?.score ?? 0,
        });
        this.mode.onEntityDeath?.(this, tank);
      }

      if (physicsBody && health && !health.isDead()) {
        gameEvents.emit("playerPos", {
          x: physicsBody.body.position.x,
          y: physicsBody.body.position.y,
        });

        this.viewport.moveCenter(
          physicsBody.body.position.x,
          physicsBody.body.position.y
        );
      }
    }

    this.hudTick += delta;
    if (this.hudTick > 100) {
      this.hudTick = 0;
      emitHudUpdate(this.entityManager);
    }

    this.minimapTick += delta;
    if (this.minimapTick > 500) {
      this.minimapTick = 0;
      this.emitMinimap();
    }
  }

  private emitMinimap() {
    const player = this.entityManager.getEntity("player");
    const playerBody = player?.getComponent("PhysicsBody");
    if (!playerBody) return;

    const px = playerBody.body.position.x;
    const py = playerBody.body.position.y;

    const bots = this.entityManager
      .queryByComponents("AIController", "PhysicsBody")
      .map((b) => ({
        x: b.getComponent("PhysicsBody")!.body.position.x,
        y: b.getComponent("PhysicsBody")!.body.position.y,
        teamId: b.getComponent("Collision")?.config.teamId,
      }));

    const shapes = this.entityManager
      .queryByComponents("Wandering", "PhysicsBody")
      .map((s) => ({
        x: s.getComponent("PhysicsBody")!.body.position.x,
        y: s.getComponent("PhysicsBody")!.body.position.y,
        dist:
          (s.getComponent("PhysicsBody")!.body.position.x - px) ** 2 +
          (s.getComponent("PhysicsBody")!.body.position.y - py) ** 2,
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 40)
      .map(({ x, y }) => ({ x, y }));

    gameEvents.emit("minimapUpdate", {
      player: { x: px, y: py },
      bots,
      shapes,
      viewport: {
        x: this.viewport.left,
        y: this.viewport.top,
        width: this.viewport.worldScreenWidth,
        height: this.viewport.worldScreenHeight,
      },
    });
  }

  getEntityManager() {
    return this.entityManager;
  }

  getViewport() {
    return this.viewport;
  }

  getPlayerTank() {
    return this.entityManager.getEntity("player");
  }

  getMode() {
    return this.mode;
  }
}

export type { GameModeId };
