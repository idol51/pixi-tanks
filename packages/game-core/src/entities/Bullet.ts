import { Graphics, Point } from "pixi.js";

export class Bullet extends Graphics {
  velocity: Point;
  speed: number = 10;
  damage: number = 10;
  lifetime: number = 2000; // ms
  createdAt: number;
  ownerId: string;

  constructor(x: number, y: number, angle: number, ownerId: string) {
    super();
    this.ownerId = ownerId;
    this.circle(0, 0, 5).fill(0xffff00);
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
