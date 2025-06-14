import { TankVariant } from "../factories/TankFactory";

export type TankStats = {
  maxHealth: number;
  speed: number;
  fireRate: number;
  size: number;
  color: number;
};

export const TANK_STATS: Record<TankVariant, TankStats> = {
  botTank: {
    maxHealth: 100,
    speed: 2, // 2 pixels per frame
    fireRate: 1, // cooldown = 1000 / fireRate ms
    size: 20,
    color: 0x33aa33,
  },
  missileLauncher: {
    maxHealth: 120,
    speed: 1.5, // 1.5 pixels per frame
    fireRate: 1.5, // cooldown = 1000 / fireRate ms
    size: 22,
    color: 0xaa3333,
  },
};
