import { Graphics, Point } from "pixi.js";
import { TankStats } from "../../data/tank-stats";

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
    stats: TankStats
  ) {
    super();
    this.ownerId = ownerId;
    this.damage = stats.bulletDamage;
    this.speed = stats.bulletSpeed;
    this.lifetime = 2000;

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
