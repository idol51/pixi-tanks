import { Point } from "pixi.js";

export class Barrel {
  offset: Point;
  angleOffset: number; // For angled barrels like shotgun spread
  cooldown: number;
  recoil: number;
  lastFired: number = 0;

  constructor(offset: Point, angleOffset = 0, cooldown = 300, recoil = 0.001) {
    this.offset = offset;
    this.angleOffset = angleOffset;
    this.cooldown = cooldown;
    this.recoil = recoil;
  }

  canFire(): boolean {
    return performance.now() - this.lastFired >= this.cooldown;
  }

  recordFire() {
    this.lastFired = performance.now();
  }
}
