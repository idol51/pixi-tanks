import { InputComponent } from "./components/InputComponent";
import { EntityManager } from "./ecs/EntityManager";
import { System } from "./ecs/System";
import { Grid } from "./entities/Grid";
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

// game/GameWorld.ts
export class GameWorld {
  private entityManager = new EntityManager();
  private systems: System[] = [];

  constructor(private viewport: Viewport) {
    const grid = new Grid(5000, 5000);
    viewport.drag().decelerate();
    viewport.addChild(grid);
    this.systems.push(
      new MovementSystem(),
      new HealthSystem(),
      new HealthBarSystem(),
      new RenderSystem(this.viewport),
      new TurretAimingSystem(this.viewport),
      new ShootingSystem(),
      new CollisionSystem(this.entityManager),
      new AISystem()
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
    for (let i = 0; i < 5; i++) {
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
  }

  update(
    delta: number,
    keys: Set<string>,
    mouse: Map<"x" | "y" | "mousedown", unknown>
  ) {
    Engine.update(engine, delta);
    for (const system of this.systems) {
      system.update(this.entityManager);
    }

    const tank = this.entityManager.getEntity("player");

    if (tank) {
      const physicsBody = tank.getComponent("PhysicsBody");
      const input = tank.getComponent("Input");

      if (!physicsBody || !input) return;

      this.viewport.moveCenter(
        physicsBody.body.position.x,
        physicsBody.body.position.y
      );
      if (input) {
        input.direction = { x: 0, y: 0 };
        input.fire = false;
        if (keys.has("w") || keys.has("arrowup")) input.direction.y = -1;
        if (keys.has("s") || keys.has("arrowdown")) input.direction.y = 1;
        if (keys.has("a") || keys.has("arrowleft")) input.direction.x = -1;
        if (keys.has("d") || keys.has("arrowright")) input.direction.x = 1;

        input.fire = keys.has(" ") || (mouse.get("mousedown") as boolean);

        input.mousePosition.x = (mouse.get("x") || 0) as number;
        input.mousePosition.y = (mouse.get("y") || 0) as number;
      }
    }
  }

  getEntityManager() {
    return this.entityManager;
  }
}
