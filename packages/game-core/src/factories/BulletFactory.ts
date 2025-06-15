import { BulletStats } from "../data/tank-stats";
import { Bullet } from "../entities/Bullet/Bullet";
import { MissileBullet } from "../entities/Bullet/MissileBullet";
import { FillInput } from "pixi.js";

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
    ownerId: string,
    color: FillInput,
    stats: BulletStats
  ): Bullet {
    switch (type) {
      case BulletType.BULLET:
        return new Bullet(x, y, angle, ownerId, color, stats);
      case BulletType.MISSILE:
        return new MissileBullet(x, y, angle, ownerId, color, stats);
    }
  }
}
