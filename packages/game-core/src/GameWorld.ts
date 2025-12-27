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
import { createWanderingShape } from "./factories/WanderingShapeFactory";
import { spawnNest } from "./utils/spawnNest";
import { WanderingSystem } from "./systems/WanderingSystem";

export class GameWorld {
  private entityManager = new EntityManager();
  private systems: System[] = [];

  constructor(
    private viewport: Viewport,
    worldWidth: number,
    worldHeight: number
  ) {
    viewport.drag().decelerate();
    createWorld(viewport, worldWidth, worldHeight);
    this.systems.push(
      new MovementSystem(),
      new HealthSystem(),
      new HealthBarSystem(),
      new RenderSystem(this.viewport),
      new TurretAimingSystem(this.viewport),
      new ShootingSystem(),
      new CollisionSystem(this.entityManager),
      new AISystem(),
      new WanderingSystem()
    );
  }

  init() {
    // 🧠 Here’s where you add tanks, bullets, obstacles etc.
    const tank = spawnTank({
      id: "player",
      em: this.entityManager,
      viewport: this.viewport,
      x: 400,
      y: 300,
      options: {
        health: 100,
        color: 0x00ff00,
      },
    });
    tank.addComponent("Input", new InputComponent());

    // ✅ Spawn enemies
    for (let i = 0; i < 1; i++) {
      const x = Math.random() * 800;
      const y = Math.random() * 600;
      spawnTank({
        id: `enemy-${i + 1}`,
        em: this.entityManager,
        viewport: this.viewport,
        x,
        y,
        isAI: true,
        options: {
          health: 80,
          color: 0xff4444,
        },
        teamId: "enemy",
      });
    }

    for (let i = 0; i < 10; i++) {
      const shape = createWanderingShape(
        this.entityManager,
        "triangle",
        Math.random() * 200,
        Math.random() * 200
      );
    }

    for (let i = 0; i < 10; i++) {
      const shape = createWanderingShape(
        this.entityManager,
        "square",
        Math.random() * 200,
        Math.random() * 200
      );
    }

    // Nest in center
    const nest = spawnNest(this.entityManager, 2500, 2500, 8);
  }

  update(delta: number) {
    Engine.update(engine, delta);
    for (const system of this.systems) {
      system.update(this.entityManager);
    }

    const tank = this.entityManager.getEntity("player");

    if (tank) {
      const physicsBody = tank.getComponent("PhysicsBody");

      if (!physicsBody) return;

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

  getEntityManager() {
    return this.entityManager;
  }

  getPlayerTank() {
    return this.entityManager.getEntity("player");
  }
}
