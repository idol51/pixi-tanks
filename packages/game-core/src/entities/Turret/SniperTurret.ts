import { Turret } from "./Turret";
import { Bullet } from "../Bullet/Bullet";
import { BaseTank } from "../Tank/base-tank";
import { BulletFactory, BulletType } from "../../factories/BulletFactory";

export class SniperTurret extends Turret {
  draw() {
    this.graphics.clear();
    this.graphics.rect(0, -4, 30, 8).fill(this.turretColor);
  }

  fire(owner: BaseTank): Bullet[] {
    const now = performance.now();

    const fireRate = owner.getStats().fireRate;
    const cooldown = 1000 / fireRate;
    if (now - this.lastFiredAt < cooldown) return [];

    this.lastFiredAt = now;
    const angle = owner.rotation + this.rotation;
    const offsetX = Math.cos(angle) * 30;
    const offsetY = Math.sin(angle) * 30;

    const bullet = BulletFactory.create(
      BulletType.BULLET,
      owner.position.x + offsetX,
      owner.position.y + offsetY,
      angle,
      owner.id,
      owner.color,
      owner.getStats()
    );

    return [bullet];
  }
}
