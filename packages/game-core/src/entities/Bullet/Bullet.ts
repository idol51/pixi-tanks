import { FillInput, Graphics, Point } from "pixi.js";
import { BulletStats } from "../../data/tank-stats";
import { BaseBullet } from "./BaseBullet";

export class Bullet extends BaseBullet {
  constructor(
    x: number,
    y: number,
    angle: number,
    ownerId: string,
    color: FillInput,
    stats: BulletStats
  ) {
    super(
      x,
      y,
      angle,
      `${ownerId}-${performance.now()}`,
      ownerId,
      color,
      stats
    );
  }

  draw() {
    this.graphics.circle(0, 0, this.radius).fill(this.color);
  }

  update(delta: number) {
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.age += delta * 16.67; // Approximate ms per frame at 60fps
  }
}
