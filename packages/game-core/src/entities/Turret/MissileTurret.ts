import { Turret } from "./Turret";
import { MissileBullet } from "../Bullet/MissileBullet";
import { BaseTank } from "../Tank/base-tank";

export class MissileTurret extends Turret {
  fire(owner: BaseTank, overrideAngle?: number) {
    const now = performance.now();

    const fireRate = owner.getStats().fireRate;
    const cooldown = 1000 / fireRate;

    if (now - this.lastFiredAt < cooldown) return null;

    this.lastFiredAt = now;

    const angle = (overrideAngle ?? 0) + owner.rotation + this.rotation;
    const offsetX = Math.cos(angle) * 30;
    const offsetY = Math.sin(angle) * 30;

    const stats = owner.getStats();

    return new MissileBullet(
      owner.position.x + offsetX,
      owner.position.y + offsetY,
      angle,
      owner.id,
      stats
    );
  }
}
