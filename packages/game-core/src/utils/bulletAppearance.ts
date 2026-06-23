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
    radius = 14;
  } else if (bulletDamage >= 30) {
    radius = 11;
  } else if (bulletDamage >= 20) {
    radius = 9;
  } else if (bulletDamage >= 14) {
    radius = 7;
  } else {
    radius = 6;
  }

  return { radius, color };
}
