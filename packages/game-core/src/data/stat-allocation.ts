export const UPGRADEABLE_STATS = [
  "maxHealth",
  "healthRegen",
  "speed",
  "reload",
  "bulletDamage",
  "bulletPenetration",
  "bulletSpeed",
] as const;

export type UpgradeableStat = (typeof UPGRADEABLE_STATS)[number];

export const MAX_STAT_POINTS = 7;

export const POINT_SCALE = 0.1;

export function createEmptyAllocations(): Record<UpgradeableStat, number> {
  return {
    maxHealth: 0,
    healthRegen: 0,
    speed: 0,
    reload: 0,
    bulletDamage: 0,
    bulletPenetration: 0,
    bulletSpeed: 0,
  };
}

export function sumAllocations(
  allocations: Record<UpgradeableStat, number>
): number {
  return UPGRADEABLE_STATS.reduce((sum, stat) => sum + allocations[stat], 0);
}
