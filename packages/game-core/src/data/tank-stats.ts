export type TankStatMultipliers = {
  maxHealth?: number;
  healthRegen?: number;
  speed?: number;
  reload?: number;
  bulletDamage?: number;
  bulletPenetration?: number;
  bulletSpeed?: number;
};

export type BaseTankStats = {
  maxHealth: number;
  healthRegen: number;
  speed: number;
  reload: number;
  bulletDamage: number;
  bulletPenetration: number;
  bulletSpeed: number;
  color: number;
};

export const BASE_TANK_STATS: Record<string, BaseTankStats> = {
  SHOTGUN: {
    maxHealth: 100,
    healthRegen: 1,
    speed: 1.2,
    reload: 1.5,
    bulletDamage: 20,
    bulletPenetration: 10,
    bulletSpeed: 6,
    color: 0xff9900,
  },
  SNIPER: {
    maxHealth: 80,
    healthRegen: 0.5,
    speed: 0.8,
    reload: 2.5,
    bulletDamage: 50,
    bulletPenetration: 40,
    bulletSpeed: 10,
    color: 0x66ccff,
  },
  // ...more
};
