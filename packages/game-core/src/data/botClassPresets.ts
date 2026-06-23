import { TankClassId } from "./tank-classes";

const TIER1_CLASSES: TankClassId[] = [
  "twin",
  "sniper",
  "machineGun",
  "flankGuard",
  "brawler",
];

const TIER2_CLASSES: TankClassId[] = [
  "triple",
  "assassin",
  "gunner",
  "triAngle",
  "destroyer",
];

const TIER3_CLASSES: TankClassId[] = [
  "quad",
  "ranger",
  "sprayer",
  "booster",
  "annihilator",
];

const BOSS_CLASSES: TankClassId[] = ["annihilator", "ranger"];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getTierForWave(wave: number): 1 | 2 | 3 {
  if (wave <= 2) return 1;
  if (wave <= 4) return 2;
  return 3;
}

export function pickBotClassForWave(wave: number): TankClassId {
  const tier = getTierForWave(wave);
  if (tier === 1) return pickRandom(TIER1_CLASSES);
  if (tier === 2) return pickRandom(TIER2_CLASSES);
  return pickRandom(TIER3_CLASSES);
}

export function pickBotClassForFfa(botIndex: number): TankClassId {
  if (botIndex <= 5) return "basic";
  if (botIndex <= 8) {
    return TIER1_CLASSES[botIndex % TIER1_CLASSES.length];
  }
  return TIER2_CLASSES[botIndex % TIER2_CLASSES.length];
}

export function pickBossClass(): TankClassId {
  return pickRandom(BOSS_CLASSES);
}

export function isBossWave(wave: number): boolean {
  return wave >= 5 && wave % 5 === 0;
}
