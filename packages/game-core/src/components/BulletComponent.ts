import { Component } from "../ecs/Component";

export class BulletComponent implements Component {
  spawnTime: number;
  spawnX: number;
  spawnY: number;
  maxDistance: number;
  maxLifetimeMs: number;
  penetration: number;

  constructor(
    spawnX: number,
    spawnY: number,
    options?: {
      maxDistance?: number;
      maxLifetimeMs?: number;
      penetration?: number;
    }
  ) {
    this.spawnTime = performance.now();
    this.spawnX = spawnX;
    this.spawnY = spawnY;
    this.maxDistance = options?.maxDistance ?? 800;
    this.maxLifetimeMs = options?.maxLifetimeMs ?? 3000;
    this.penetration = options?.penetration ?? 10;
  }
}
