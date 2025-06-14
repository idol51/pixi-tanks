import { Graphics, Point } from "pixi.js";
import { TankStats } from "../../data/tank-stats";

export class MissileBullet extends Graphics {
  radius = 6;
  velocity: Point;
  speed: number;
  acceleration = 0.1;
  damage: number;
  lifetime = 3000;
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

    this.circle(0, 0, this.radius).fill(0xff6600);
    this.position.set(x, y);
    this.velocity = new Point(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );
    this.createdAt = performance.now();
  }

  update(delta: number) {
    this.velocity.x += this.velocity.x * this.acceleration * delta;
    this.velocity.y += this.velocity.y * this.acceleration * delta;
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
  }

  isExpired() {
    return performance.now() - this.createdAt > this.lifetime;
  }
}
