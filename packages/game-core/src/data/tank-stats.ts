import { TankVariant } from "../factories/TankFactory";

export type TankStats = {
  maxHealth: number;
  speed: number;
  fireRate: number;
  bulletSpeed: number;
  bulletDamage: number;
  size: number;
  color: number;
};

export const TANK_STATS: Record<TankVariant, TankStats> = {
  missileLauncher: {
    maxHealth: 120,
    speed: 1.2,
    fireRate: 1.5, // cooldown = 1000 / fireRate ms
    bulletSpeed: 6,
    bulletDamage: 30,
    size: 22,
    color: 0xaa3333,
  },
};
