export type BarrelLayout = {
  offset: [number, number];
  angleOffset?: number;
}[];

export const DEFAULT_BARREL_LAYOUT: BarrelLayout = [{ offset: [12, 0] }];

export const TWIN_BARREL_LAYOUT: BarrelLayout = [
  { offset: [12, -6] },
  { offset: [12, 6] },
];

export const TRIPLE_BARREL_LAYOUT: BarrelLayout = [
  { offset: [12, -8] },
  { offset: [12, 0] },
  { offset: [12, 8] },
];

export const QUAD_BARREL_LAYOUT: BarrelLayout = [
  { offset: [12, -10], angleOffset: -0.08 },
  { offset: [12, -3] },
  { offset: [12, 3] },
  { offset: [12, 10], angleOffset: 0.08 },
];

export const SNIPER_BARREL_LAYOUT: BarrelLayout = [{ offset: [18, 0] }];

export const MACHINE_GUN_BARREL_LAYOUT: BarrelLayout = [{ offset: [10, 0] }];

export const FLANK_BARREL_LAYOUT: BarrelLayout = [
  { offset: [8, -14], angleOffset: -Math.PI / 2 },
  { offset: [8, 14], angleOffset: Math.PI / 2 },
];

export const TRI_ANGLE_BARREL_LAYOUT: BarrelLayout = [
  { offset: [-10, -12], angleOffset: Math.PI },
  { offset: [-10, 12], angleOffset: Math.PI },
  { offset: [12, 0] },
];

export const BOOSTER_BARREL_LAYOUT: BarrelLayout = [
  { offset: [-14, -8], angleOffset: Math.PI },
  { offset: [-14, 8], angleOffset: Math.PI },
  { offset: [12, 0] },
];

export const SHOTGUN_BARREL_LAYOUT: BarrelLayout = [
  { offset: [10, -10], angleOffset: -0.1 },
  { offset: [10, 0] },
  { offset: [10, 10], angleOffset: 0.1 },
];

export const GUNNER_BARREL_LAYOUT: BarrelLayout = [
  { offset: [12, -4] },
  { offset: [12, 4] },
];

export const SPRAYER_BARREL_LAYOUT: BarrelLayout = [
  { offset: [10, -8], angleOffset: -0.15 },
  { offset: [10, -3], angleOffset: -0.05 },
  { offset: [10, 3], angleOffset: 0.05 },
  { offset: [10, 8], angleOffset: 0.15 },
];

export const DESTROYER_BARREL_LAYOUT: BarrelLayout = [{ offset: [20, 0] }];

export const ANNIHILATOR_BARREL_LAYOUT: BarrelLayout = [{ offset: [24, 0] }];
