import { BulletFactory, BulletType } from "../../factories/BulletFactory";
import { BaseTurret } from "./BaseTurret";
import { BaseTank } from "../Tank/base-tank";

export class Turret extends BaseTurret {
  draw() {
    this.graphics.clear();
    this.graphics
      .rect(
        0,
        -this.owner.getStats().bulletRadius,
        40,
        this.owner.getStats().bulletRadius * 2
      )
      .fill(this.turretColor);
  }

  aimAt(angle: number) {
    this.rotation = angle;
  }

  fire(owner: BaseTank, overrideAngle?: number) {
    const now = performance.now();

    const fireRate = owner.getStats().fireRate;
    const cooldown = 1000 / fireRate;
    if (now - this.lastFiredAt < cooldown) {
      return []; // Still cooling down
    }

    this.lastFiredAt = now;

    const angle = (overrideAngle ?? 0) + owner.rotation + this.rotation;
    const offsetX = Math.cos(angle) * 30;
    const offsetY = Math.sin(angle) * 30;

    const spawnX = owner.position.x + offsetX;
    const spawnY = owner.position.y + offsetY;

    return [
      BulletFactory.create(
        BulletType.BULLET,
        spawnX,
        spawnY,
        angle,
        owner.id,
        owner.color,
        owner.getStats()
      ),
    ];
  }
}

// Turret class removed. Use BaseTurret for all turret implementations.
