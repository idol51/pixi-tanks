// bullet-factory.ts

import { TANK_STATS } from "../data/tank-stats";
import { Bullet } from "../entities/Bullet/Bullet";
import { MissileBullet } from "../entities/Bullet/MissileBullet";

export enum BulletType {
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
      case BulletType.MISSILE:
        return new MissileBullet(
          x,
          y,
          angle,
          ownerId,
          TANK_STATS.missileLauncher
        );
    }
  }
}
