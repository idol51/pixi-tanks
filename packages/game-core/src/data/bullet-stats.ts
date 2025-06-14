import { BulletType } from "../factories/BulletFactory";

export type BulletStats = {
  speed: number;
  damage: number;
  lifetime: number;
  acceleration: number;
  radius: number;
};

export const BULLET_STATS: Record<BulletType, BulletStats> = {
  bullet: {
    speed: 4,
    damage: 10,
    lifetime: 2000,
    acceleration: 0,
    radius: 4,
  },
  missile: {
    speed: 1,
    damage: 30,
    lifetime: 3000,
    acceleration: 0.1,
    radius: 6,
  },
};
