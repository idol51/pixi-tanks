import { Graphics, Point } from "pixi.js";
import { BulletStats } from "../../data/bullet-stats";

export class Bullet extends Graphics {
  radius: number = 5;
  velocity: Point;
  speed: number;
  damage: number;
  lifetime: number;
  createdAt: number;
  ownerId: string;

  constructor(
    x: number,
    y: number,
    angle: number,
    ownerId: string,
    stats: BulletStats
  ) {
    super();
    this.ownerId = ownerId;
    this.damage = stats.damage;
    this.speed = stats.speed;
    this.lifetime = stats.lifetime;

    this.circle(0, 0, this.radius).fill(0xffff00);
    this.position.set(x, y);
    this.velocity = new Point(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );

    this.createdAt = performance.now();
  }

  update(delta: number) {
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
  }

  isExpired() {
    return performance.now() - this.createdAt > this.lifetime;
  }
}
