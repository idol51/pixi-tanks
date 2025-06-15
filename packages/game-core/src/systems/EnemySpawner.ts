// /systems/EnemySpawner.ts
import { AIControllerComponent } from "../entities/Tank/components/AIControllerComponent";
import { TankFactory, TankVariant } from "../factories/TankFactory";
import { GameWorld } from "../GameWorld";
import { v4 as uuid } from "uuid";

export class EnemySpawner {
  private world: GameWorld;
  private lastSpawnedAt: number = 0;
  private spawnInterval: number = 3000; // 3 seconds
  private maxEnemies: number = 10;

  constructor(world: GameWorld) {
    this.world = world;
  }

  update(_delta: number) {
    const now = performance.now();

    // Count active enemies (excluding player)
    const enemiesAlive = Array.from(this.world.tanks.values()).filter((tank) =>
      tank.tags.has("ai")
    ).length;

    if (
      enemiesAlive >= this.maxEnemies ||
      now - this.lastSpawnedAt < this.spawnInterval
    ) {
      return;
    }

    // Spawn a new AI enemy
    const id = `enemy-${uuid()}`;
    const name = "Grunt";
    const enemy = TankFactory.createTank(TankVariant.BOT, name, id, 0xff0000);
    enemy.tags.add("ai");

    // Random spawn position within viewport bounds
    enemy.position.set(
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000
    );

    // Add AI controller as component
    enemy.addComponent(new AIControllerComponent(this.world));

    // Register with world
    this.world.tanks.set(id, enemy);
    this.world.viewport.addChild(enemy);

    this.lastSpawnedAt = now;
  }
}
