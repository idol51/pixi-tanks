import { Graphics } from "pixi.js";
import { TankClassId } from "../data/tank-classes";

export type BarrelVisualVariant = "cannon" | "thruster";

export type BarrelLayoutEntry = {
  offset: [number, number];
  angleOffset?: number;
};

export type BarrelVisualSpec = {
  length: number;
  width: number;
  variant: BarrelVisualVariant;
  fillColor: number;
  strokeColor: number;
};

const SNIPER_CLASSES: TankClassId[] = ["sniper", "assassin", "ranger"];
const DESTROYER_CLASSES: TankClassId[] = ["destroyer", "annihilator"];
const MG_CLASSES: TankClassId[] = ["machineGun", "gunner", "sprayer"];

function isRearThruster(
  classId: TankClassId,
  entry: BarrelLayoutEntry
): boolean {
  if (classId !== "triAngle" && classId !== "booster") return false;
  const angle = entry.angleOffset ?? 0;
  return entry.offset[0] < 0 || Math.abs(angle - Math.PI) < 0.2;
}

function baseLengthFromOffset(entry: BarrelLayoutEntry): number {
  const forward = Math.max(0, entry.offset[0]);
  return Math.max(22, forward + 10);
}

export function resolveBarrelVisual(
  classId: TankClassId,
  _barrelIndex: number,
  entry: BarrelLayoutEntry
): BarrelVisualSpec {
  const variant: BarrelVisualVariant = isRearThruster(classId, entry)
    ? "thruster"
    : "cannon";

  let length = baseLengthFromOffset(entry);
  let width = 8;

  if (DESTROYER_CLASSES.includes(classId)) {
    length = classId === "annihilator" ? 48 : 40;
    width = classId === "annihilator" ? 14 : 12;
  } else if (SNIPER_CLASSES.includes(classId)) {
    length = classId === "ranger" ? 42 : classId === "assassin" ? 38 : 34;
    width = 7;
  } else if (MG_CLASSES.includes(classId)) {
    length = classId === "sprayer" ? 20 : 22;
    width = classId === "sprayer" ? 7 : 10;
  } else if (classId === "flankGuard") {
    length = 24;
    width = 8;
  } else if (classId === "brawler") {
    length = 26;
    width = 9;
  } else if (
    classId === "twin" ||
    classId === "triple" ||
    classId === "quad" ||
    classId === "gunner"
  ) {
    length = classId === "quad" ? 24 : classId === "triple" ? 26 : 28;
    width = classId === "quad" ? 7 : 8;
  } else if (classId === "basic") {
    length = 28;
    width = 8;
  }

  if (variant === "thruster") {
    length = Math.min(length, 18);
    width += 4;
  }

  const fillColor = variant === "thruster" ? 0x886644 : 0xb8b8b8;
  const strokeColor = variant === "thruster" ? 0x664422 : 0x888888;

  return { length, width, variant, fillColor, strokeColor };
}

export function drawBarrelGraphic(g: Graphics, spec: BarrelVisualSpec): void {
  const corner = Math.min(spec.width / 2, 3);
  g.roundRect(0, -spec.width / 2, spec.length, spec.width, corner);
  g.fill(spec.fillColor);
  g.stroke({ width: 1, color: spec.strokeColor });
}

export function barrelColorToHex(color: number): string {
  return `#${color.toString(16).padStart(6, "0")}`;
}
