import { BaseTankStats, DEFAULT_TANK_STATS } from "./tank-stats";
import {
  ANNIHILATOR_BARREL_LAYOUT,
  BOOSTER_BARREL_LAYOUT,
  DEFAULT_BARREL_LAYOUT,
  DESTROYER_BARREL_LAYOUT,
  FLANK_BARREL_LAYOUT,
  GUNNER_BARREL_LAYOUT,
  MACHINE_GUN_BARREL_LAYOUT,
  QUAD_BARREL_LAYOUT,
  SNIPER_BARREL_LAYOUT,
  SPRAYER_BARREL_LAYOUT,
  TRI_ANGLE_BARREL_LAYOUT,
  TRIPLE_BARREL_LAYOUT,
  TWIN_BARREL_LAYOUT,
  BarrelLayout,
} from "./barrel-layouts";

export const EVOLUTION_LEVELS = [15, 30, 45] as const;

export type TankClassId =
  | "basic"
  | "twin"
  | "sniper"
  | "machineGun"
  | "flankGuard"
  | "brawler"
  | "triple"
  | "assassin"
  | "gunner"
  | "triAngle"
  | "destroyer"
  | "quad"
  | "ranger"
  | "sprayer"
  | "booster"
  | "annihilator";

export type BodyStyle = {
  radius: number;
  color: number;
};

export type TankClassDef = {
  id: TankClassId;
  name: string;
  description: string;
  parentId: TankClassId | null;
  evolveAt: number | null;
  stats: BaseTankStats;
  barrelLayout: BarrelLayout;
  bodyStyle: BodyStyle;
};

const TIER1_STATS: Record<string, Partial<BaseTankStats>> = {
  twin: {
    reload: 1.8,
    bulletDamage: 18,
    bulletPenetration: 12,
    color: 0x66ff66,
  },
  sniper: {
    maxHealth: 80,
    reload: 2.5,
    bulletDamage: 38,
    bulletPenetration: 40,
    bulletSpeed: 8.5,
    speed: 0.8,
    color: 0x66ccff,
  },
  machineGun: {
    reload: 4.2,
    bulletDamage: 14,
    bulletPenetration: 9,
    bulletSpeed: 8,
    speed: 1.15,
    color: 0xffcc00,
  },
  flankGuard: {
    reload: 1.9,
    bulletDamage: 18,
    bulletPenetration: 11,
    speed: 1.2,
    color: 0xff9966,
  },
  brawler: {
    maxHealth: 140,
    healthRegen: 1,
    reload: 2,
    bulletDamage: 18,
    bulletPenetration: 12,
    bulletSpeed: 6,
    speed: 0.9,
    color: 0xff8800,
  },
};

const TIER2_STATS: Record<string, Partial<BaseTankStats>> = {
  triple: {
    reload: 2,
    bulletDamage: 16,
    bulletPenetration: 14,
    color: 0x55ee55,
  },
  assassin: {
    maxHealth: 75,
    reload: 3,
    bulletDamage: 45,
    bulletPenetration: 50,
    bulletSpeed: 9,
    speed: 0.75,
    color: 0x5599ff,
  },
  gunner: {
    reload: 4,
    bulletDamage: 10,
    bulletPenetration: 9,
    bulletSpeed: 8,
    color: 0xffdd33,
  },
  triAngle: {
    reload: 1.8,
    bulletDamage: 15,
    bulletPenetration: 11,
    speed: 1.25,
    color: 0xff7744,
  },
  destroyer: {
    maxHealth: 130,
    reload: 1.2,
    bulletDamage: 36,
    bulletPenetration: 35,
    bulletSpeed: 8,
    speed: 0.85,
    color: 0xff6600,
  },
};

const TIER3_STATS: Record<string, Partial<BaseTankStats>> = {
  quad: {
    reload: 2.2,
    bulletDamage: 15,
    bulletPenetration: 16,
    color: 0x44dd44,
  },
  ranger: {
    maxHealth: 70,
    reload: 2.8,
    bulletDamage: 44,
    bulletPenetration: 45,
    bulletSpeed: 9,
    speed: 0.85,
    color: 0x4488ff,
  },
  sprayer: {
    reload: 5,
    bulletDamage: 9,
    bulletPenetration: 8,
    bulletSpeed: 8,
    color: 0xffee22,
  },
  booster: {
    reload: 1.6,
    bulletDamage: 14,
    bulletPenetration: 10,
    speed: 1.4,
    color: 0xff5522,
  },
  annihilator: {
    maxHealth: 120,
    reload: 0.9,
    bulletDamage: 48,
    bulletPenetration: 50,
    bulletSpeed: 7,
    speed: 0.8,
    color: 0xff4400,
  },
};

function mergeStats(overrides: Partial<BaseTankStats>): BaseTankStats {
  return { ...DEFAULT_TANK_STATS, ...overrides };
}

function def(
  id: TankClassId,
  name: string,
  description: string,
  parentId: TankClassId | null,
  evolveAt: number | null,
  stats: BaseTankStats,
  barrelLayout: BarrelLayout,
  bodyStyle: BodyStyle
): TankClassDef {
  return { id, name, description, parentId, evolveAt, stats, barrelLayout, bodyStyle };
}

export const TANK_CLASS_TREE: Record<TankClassId, TankClassDef> = {
  basic: def(
    "basic",
    "Basic Tank",
    "A balanced starter with one cannon.",
    null,
    null,
    mergeStats({ color: 0x00ff00 }),
    DEFAULT_BARREL_LAYOUT,
    { radius: 20, color: 0x00ff00 }
  ),
  twin: def(
    "twin",
    "Twin",
    "Two parallel barrels for double firepower.",
    "basic",
    15,
    mergeStats(TIER1_STATS.twin),
    TWIN_BARREL_LAYOUT,
    { radius: 20, color: 0x66ff66 }
  ),
  sniper: def(
    "sniper",
    "Sniper",
    "Long barrel, high damage and penetration.",
    "basic",
    15,
    mergeStats(TIER1_STATS.sniper),
    SNIPER_BARREL_LAYOUT,
    { radius: 19, color: 0x66ccff }
  ),
  machineGun: def(
    "machineGun",
    "Machine Gun",
    "Rapid fire with lighter bullets.",
    "basic",
    15,
    mergeStats(TIER1_STATS.machineGun),
    MACHINE_GUN_BARREL_LAYOUT,
    { radius: 20, color: 0xffcc00 }
  ),
  flankGuard: def(
    "flankGuard",
    "Flank Guard",
    "Side-mounted cannons for angled shots.",
    "basic",
    15,
    mergeStats(TIER1_STATS.flankGuard),
    FLANK_BARREL_LAYOUT,
    { radius: 20, color: 0xff9966 }
  ),
  brawler: def(
    "brawler",
    "Brawler",
    "Heavy armor with spread shot.",
    "basic",
    15,
    mergeStats(TIER1_STATS.brawler),
    TWIN_BARREL_LAYOUT,
    { radius: 24, color: 0xff8800 }
  ),
  triple: def(
    "triple",
    "Triple Shot",
    "Three barrels firing in a spread.",
    "twin",
    30,
    mergeStats(TIER2_STATS.triple),
    TRIPLE_BARREL_LAYOUT,
    { radius: 21, color: 0x55ee55 }
  ),
  assassin: def(
    "assassin",
    "Assassin",
    "Deadly single shot with extreme penetration.",
    "sniper",
    30,
    mergeStats(TIER2_STATS.assassin),
    SNIPER_BARREL_LAYOUT,
    { radius: 18, color: 0x5599ff }
  ),
  gunner: def(
    "gunner",
    "Gunner",
    "Twin rapid-fire cannons.",
    "machineGun",
    30,
    mergeStats(TIER2_STATS.gunner),
    GUNNER_BARREL_LAYOUT,
    { radius: 20, color: 0xffdd33 }
  ),
  triAngle: def(
    "triAngle",
    "Tri-Angle",
    "Rear and front guns for hit-and-run.",
    "flankGuard",
    30,
    mergeStats(TIER2_STATS.triAngle),
    TRI_ANGLE_BARREL_LAYOUT,
    { radius: 20, color: 0xff7744 }
  ),
  destroyer: def(
    "destroyer",
    "Destroyer",
    "One massive bullet with huge knockback.",
    "brawler",
    30,
    mergeStats(TIER2_STATS.destroyer),
    DESTROYER_BARREL_LAYOUT,
    { radius: 24, color: 0xff6600 }
  ),
  quad: def(
    "quad",
    "Quad Tank",
    "Four barrels covering a wide arc.",
    "triple",
    45,
    mergeStats(TIER3_STATS.quad),
    QUAD_BARREL_LAYOUT,
    { radius: 22, color: 0x44dd44 }
  ),
  ranger: def(
    "ranger",
    "Ranger",
    "Extreme range and bullet speed.",
    "assassin",
    45,
    mergeStats(TIER3_STATS.ranger),
    SNIPER_BARREL_LAYOUT,
    { radius: 18, color: 0x4488ff }
  ),
  sprayer: def(
    "sprayer",
    "Sprayer",
    "Four-barrel spray of bullets.",
    "gunner",
    45,
    mergeStats(TIER3_STATS.sprayer),
    SPRAYER_BARREL_LAYOUT,
    { radius: 21, color: 0xffee22 }
  ),
  booster: def(
    "booster",
    "Booster",
    "Rear thrusters and front cannon for speed.",
    "triAngle",
    45,
    mergeStats(TIER3_STATS.booster),
    BOOSTER_BARREL_LAYOUT,
    { radius: 20, color: 0xff5522 }
  ),
  annihilator: def(
    "annihilator",
    "Annihilator",
    "The ultimate single-shot destroyer.",
    "destroyer",
    45,
    mergeStats(TIER3_STATS.annihilator),
    ANNIHILATOR_BARREL_LAYOUT,
    { radius: 26, color: 0xff4400 }
  ),
};

export function getClassDef(id: TankClassId): TankClassDef {
  return TANK_CLASS_TREE[id];
}

export function getEvolutionChoices(
  currentClassId: TankClassId,
  level: number
): TankClassId[] {
  if (!EVOLUTION_LEVELS.includes(level as (typeof EVOLUTION_LEVELS)[number])) {
    return [];
  }

  return Object.values(TANK_CLASS_TREE)
    .filter((c) => c.parentId === currentClassId && c.evolveAt === level)
    .map((c) => c.id);
}

export function getClassName(id: TankClassId): string {
  return TANK_CLASS_TREE[id]?.name ?? id;
}
