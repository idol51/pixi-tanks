import { TankClassId } from "../data/tank-classes";
import { ShapeType } from "../factories/WanderingShapeFactory";

export const TANK_TEXTURE_KEYS: Record<TankClassId, string> = {
  basic: "tank:basic",
  twin: "tank:twin",
  sniper: "tank:sniper",
  machineGun: "tank:machineGun",
  flankGuard: "tank:flankGuard",
  brawler: "tank:brawler",
  triple: "tank:triple",
  assassin: "tank:assassin",
  gunner: "tank:gunner",
  triAngle: "tank:triAngle",
  destroyer: "tank:destroyer",
  quad: "tank:quad",
  ranger: "tank:ranger",
  sprayer: "tank:sprayer",
  booster: "tank:booster",
  annihilator: "tank:annihilator",
};

export const SHAPE_TEXTURE_KEYS: Record<ShapeType, string> = {
  triangle: "shape:triangle",
  square: "shape:square",
  pentagon: "shape:pentagon",
  hexagon: "shape:hexagon",
};

export const TANK_ASSET_URLS: Record<TankClassId, string> = {
  basic: "/assets/tanks/basic.svg",
  twin: "/assets/tanks/twin.svg",
  sniper: "/assets/tanks/sniper.svg",
  machineGun: "/assets/tanks/machineGun.svg",
  flankGuard: "/assets/tanks/flankGuard.svg",
  brawler: "/assets/tanks/brawler.svg",
  triple: "/assets/tanks/triple.svg",
  assassin: "/assets/tanks/assassin.svg",
  gunner: "/assets/tanks/gunner.svg",
  triAngle: "/assets/tanks/triAngle.svg",
  destroyer: "/assets/tanks/destroyer.svg",
  quad: "/assets/tanks/quad.svg",
  ranger: "/assets/tanks/ranger.svg",
  sprayer: "/assets/tanks/sprayer.svg",
  booster: "/assets/tanks/booster.svg",
  annihilator: "/assets/tanks/annihilator.svg",
};

export const SHAPE_ASSET_URLS: Record<ShapeType, string> = {
  triangle: "/assets/shapes/triangle.svg",
  square: "/assets/shapes/square.svg",
  pentagon: "/assets/shapes/pentagon.svg",
  hexagon: "/assets/shapes/hexagon.svg",
};

export function getTankTextureKey(classId: TankClassId): string {
  return TANK_TEXTURE_KEYS[classId];
}

export function getShapeTextureKey(shape: ShapeType): string {
  return SHAPE_TEXTURE_KEYS[shape];
}

export function getTankAssetUrl(classId: TankClassId): string {
  return TANK_ASSET_URLS[classId];
}

export function getShapeAssetUrl(shape: ShapeType): string {
  return SHAPE_ASSET_URLS[shape];
}
