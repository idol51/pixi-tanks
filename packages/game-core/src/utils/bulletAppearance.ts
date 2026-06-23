import { BaseTankStats } from "../data/tank-stats";

export type BulletVisuals = {
  radius: number;
  color: number;
};

/** Derive bullet size and color from shooter stats (diep.io-style class variety). */
export function getBulletVisuals(stats: BaseTankStats): BulletVisuals {
  const { bulletDamage, color } = stats;

  let radius: number;
  if (bulletDamage >= 40) {
    radius = 8;
  } else if (bulletDamage >= 30) {
    radius = 6.5;
  } else if (bulletDamage >= 20) {
    radius = 5;
  } else if (bulletDamage >= 14) {
    radius = 4;
  } else {
    radius = 3.5;
  }

  return { radius, color };
}
