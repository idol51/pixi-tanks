import { FillInput } from "pixi.js";
import { BulletStats } from "../../data/tank-stats";
import { BaseBullet } from "./BaseBullet";

export class MissileBullet extends BaseBullet {
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
    this.graphics.clear();
    // Draw a triangle pointing to the right (missile forward direction)
    this.graphics
      .poly([
        this.radius,
        0, // tip (forward)
        -this.radius,
        -this.radius, // back left
        -this.radius,
        this.radius, // back right
      ])
      .fill(this.color);
    // Set pivot to the center of the base for correct rotation
    this.graphics.pivot.set(0, 0);
    // Rotate to match velocity direction (point away from tank)
    this.graphics.rotation = Math.atan2(this.velocity.y, this.velocity.x);
  }

  update(delta: number) {
    this.velocity.x += this.velocity.x * this.acceleration * delta;
    this.velocity.y += this.velocity.y * this.acceleration * delta;
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.age += delta * 16.67; // Approximate ms per frame at 60fps
  }
}
