import { BULLET_STATS } from "../data/bullet-stats";
import { Bullet } from "../entities/Bullet/Bullet";
import { MissileBullet } from "../entities/Bullet/MissileBullet";

export enum BulletType {
  BULLET = "bullet",
  MISSILE = "missile",
}

export class BulletFactory {
  static create(
    type: BulletType,
    x: number,
    y: number,
    angle: number,
    ownerId: string
  ): Bullet {
    switch (type) {
      case BulletType.BULLET:
        return new Bullet(x, y, angle, ownerId, BULLET_STATS.bullet);
      case BulletType.MISSILE:
        return new MissileBullet(x, y, angle, ownerId, BULLET_STATS.missile);
    }
  }
}
