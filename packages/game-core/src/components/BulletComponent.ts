import { Component } from "../ecs/Component";

export class BulletComponent implements Component {
  spawnTime: number;
  spawnX: number;
  spawnY: number;
  maxDistance: number;
  maxLifetimeMs: number;
  /** Remaining damage pool (depletes on hits). */
  damage: number;
  /** Remaining penetration pool (depletes on hits). */
  penetration: number;
  readonly maxDamage: number;
  readonly maxPenetration: number;

  constructor(
    spawnX: number,
    spawnY: number,
    options?: {
      maxDistance?: number;
      maxLifetimeMs?: number;
      damage?: number;
      penetration?: number;
    }
  ) {
    this.spawnTime = performance.now();
    this.spawnX = spawnX;
    this.spawnY = spawnY;
    this.maxDistance = options?.maxDistance ?? 800;
    this.maxLifetimeMs = options?.maxLifetimeMs ?? 3000;
    this.damage = options?.damage ?? 10;
    this.penetration = options?.penetration ?? 10;
    this.maxDamage = this.damage;
    this.maxPenetration = this.penetration;
  }

  getPools(): { damage: number; penetration: number } {
    return { damage: this.damage, penetration: this.penetration };
  }
}
