import { InputComponent } from "./components/InputComponent";
import { EntityManager } from "./ecs/EntityManager";
import { System } from "./ecs/System";
import { Grid } from "./entities/Grid";
import { spawnTank } from "./factories/TankFactory";
import { HealthSystem } from "./systems/HealthSystem";
import { MovementSystem } from "./systems/MovementSystem";
import { RenderSystem } from "./systems/RenderSystem";
import { Viewport } from "pixi-viewport";
import { Engine } from "matter-js";
import { engine } from "./physics/engine";

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
      new RenderSystem(this.viewport)
    );
  }

  init() {
    // 🧠 Here’s where you add tanks, bullets, obstacles etc.
    const tank = spawnTank("player", this.entityManager, 400, 300, {
      health: 100,
      color: 0x00ff00,
    });
    tank.addComponent("Input", new InputComponent());

    // ✅ Spawn enemies
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * 800;
      const y = Math.random() * 600;
      spawnTank(`enemy-${i + 1}`, this.entityManager, x, y, {
        health: 80,
        color: 0xff4444,
      });
    }
  }

  update(delta: number, keys: Set<string>) {
    Engine.update(engine, delta);
    for (const system of this.systems) {
      system.update(delta, this.entityManager);
    }

    const tank = this.entityManager.getEntity("player");
    const physicsBody = tank.getComponent("PhysicsBody");
    const input = tank.getComponent("Input");

    this.viewport.moveCenter(
      physicsBody.body.position.x,
      physicsBody.body.position.y
    );
    if (input) {
      input.direction = { x: 0, y: 0 };
      if (keys.has("w") || keys.has("ArrowUp")) input.direction.y = -1;
      if (keys.has("s") || keys.has("ArrowDown")) input.direction.y = 1;
      if (keys.has("a") || keys.has("ArrowLeft")) input.direction.x = -1;
      if (keys.has("d") || keys.has("ArrowRight")) input.direction.x = 1;
    }
  }

  getEntityManager() {
    return this.entityManager;
  }
}
