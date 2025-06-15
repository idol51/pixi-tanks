import { Container, FillInput, Graphics } from "pixi.js";
import { BulletFactory, BulletType } from "../../factories/BulletFactory";
import { Bullet } from "../Bullet/Bullet";
import { BaseTurret } from "./BaseTurret";
import { BaseTank } from "../Tank/base-tank";

export class Turret extends BaseTurret {
  draw() {
    this.graphics.clear();
    this.graphics.rect(0, -4, 30, 8).fill(this.turretColor);
  }

  aimAt(angle: number) {
    this.rotation = angle;
  }

  fire(owner: BaseTank, overrideAngle?: number): Bullet[] | null {
    const now = performance.now();

    if (now - this.lastFiredAt < this.cooldown) {
      return null; // Still cooling down
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
