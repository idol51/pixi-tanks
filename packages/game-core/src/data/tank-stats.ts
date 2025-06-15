import { TankVariant } from "../factories/TankFactory";

export type BulletStats = {
  bulletSpeed: number; // Speed of the bullet in pixels per frame
  bulletDamage: number; // Damage dealt by each bullet
  bulletLifetime: number; // How long the bullet lasts before disappearing (in milliseconds)
  bulletAcceleration?: number; // Acceleration of the bullet (in pixels per frame squared)
  bulletRadius: number; // Radius of the bullet (in pixels)
};

export type TankStats = BulletStats & {
  tankSpeed: number; // Speed in pixels per frame
  tankHealth: number; // Maximum health of the tank normalized to 100
  tankSize: number; // Size of the tank in pixels
  fireRate: number; // Shots per second
  zoom?: number; // Optional zoom level for the tank normalized to 1
};

export const TANK_STATS: Record<TankVariant, TankStats> = {
  bot: {
    tankSpeed: 2, // 2 pixels per frame
    tankHealth: 100,
    fireRate: 1, // cooldown = 1000 / fireRate ms
    tankSize: 24, // Size of the tank in pixels
    bulletDamage: 10,
    bulletSpeed: 4, // Speed of the bullet in pixels per frame
    bulletLifetime: 2000, // How long the bullet lasts before disappearing (in milliseconds)
    bulletRadius: 4, // Radius of the bullet (in pixels)
  },
  missileLauncher: {
    tankSpeed: 1.5, // 1.5 pixels per frame
    tankHealth: 120,
    fireRate: 1.5, // cooldown = 1000 / fireRate ms
    tankSize: 22,
    bulletDamage: 30,
    bulletSpeed: 1, // Speed of the missile in pixels per frame
    bulletLifetime: 3000, // How long the missile lasts before disappearing (in milliseconds)
    bulletAcceleration: 0.06, // Acceleration of the missile (in pixels per frame squared)
    bulletRadius: 6, // Radius of the missile (in pixels)
    zoom: 0.9, // 👈 zoom out slightly
  },
  shotgun: {
    tankHealth: 120,
    tankSpeed: 1.2,
    fireRate: 0.8, // slower fire rate
    tankSize: 22,
    bulletDamage: 8,
    bulletSpeed: 6, // Speed of the shotgun bullet in pixels per frame
    bulletLifetime: 1500, // How long the shotgun bullet lasts before disappearing (in milliseconds)
    bulletRadius: 3, // Radius of the shotgun bullet (in pixels)
    zoom: 0.9, // 👈 zoom out slightly
  },
  sniper: {
    tankHealth: 80,
    tankSpeed: 1.1,
    fireRate: 0.5,
    tankSize: 18,
    bulletDamage: 20,
    bulletSpeed: 5, // Speed of the sniper bullet in pixels per frame
    bulletLifetime: 2500, // How long the sniper bullet lasts before disappearing (in milliseconds)
    bulletRadius: 5, // Radius of the sniper bullet (in pixels)
    zoom: 0.8, // 👈 zoom out slightly
  },
};
