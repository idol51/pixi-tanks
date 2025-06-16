// entities/Turret/ShotgunTurret.ts

import { BaseTurret } from "./BaseTurret";
import { BaseTank } from "../Tank/base-tank";
import { BulletFactory, BulletType } from "../../factories/BulletFactory";

export class ShotgunTurret extends BaseTurret {
  draw() {
    this.graphics.clear();
    this.graphics.rect(0, -4, 30, 8).fill(this.turretColor);
  }

  fire(owner: BaseTank) {
    const now = performance.now();

    const fireRate = owner.getStats().fireRate;
    const cooldown = 1000 / fireRate;

    if (now - this.lastFiredAt < cooldown) return [];

    this.lastFiredAt = now;

    const spread = [-0.2, -0.1, 0, 0.1, 0.2];
    const bullets = spread.map((offset) => {
      const angle = owner.rotation + this.rotation + offset;
      const offsetX = Math.cos(angle) * 30;
      const offsetY = Math.sin(angle) * 30;

      return BulletFactory.create(
        BulletType.BULLET,
        owner.position.x + offsetX,
        owner.position.y + offsetY,
        angle,
        owner.id,
        owner.color,
        owner.getStats()
      );
    });

    return bullets;
  }

  aimAt(angle: number): void {
    this.rotation = angle;
  }
}
