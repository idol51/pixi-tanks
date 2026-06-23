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

/** Hard cap for bullet velocity (world units). Applied after stat upgrades. */
export const MAX_BULLET_SPEED = 9.5;

export function clampBulletSpeed(speed: number): number {
  return Math.min(speed, MAX_BULLET_SPEED);
}

export const DEFAULT_TANK_STATS: BaseTankStats = {
  maxHealth: 120,
  healthRegen: 0.5,
  speed: 0.85,
  reload: 1.0,
  bulletDamage: 7,
  bulletPenetration: 10,
  bulletSpeed: 5.5,
  color: 0x00ff00,
};

export const BASE_TANK_STATS: Record<string, BaseTankStats> = {
  DEFAULT: DEFAULT_TANK_STATS,
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
  STRIKER: {
    maxHealth: 90,
    healthRegen: 0.8,
    speed: 1.3,
    reload: 1.2,
    bulletDamage: 25,
    bulletPenetration: 15,
    bulletSpeed: 9,
    color: 0xff4444,
  },
  FARMER: {
    maxHealth: 110,
    healthRegen: 1.5,
    speed: 1,
    reload: 1.8,
    bulletDamage: 15,
    bulletPenetration: 8,
    bulletSpeed: 7,
    color: 0x44ff44,
  },
  BRAWLER: {
    maxHealth: 140,
    healthRegen: 1,
    speed: 0.9,
    reload: 2,
    bulletDamage: 18,
    bulletPenetration: 12,
    bulletSpeed: 6,
    color: 0xff8800,
  },
};

export const BOT_PRESETS = [
  { name: "Striker", statsKey: "STRIKER" as const, tier: 1 },
  { name: "Farmer", statsKey: "FARMER" as const, tier: 1 },
  { name: "Brawler", statsKey: "BRAWLER" as const, tier: 2 },
  { name: "Sniper", statsKey: "SNIPER" as const, tier: 2 },
];
