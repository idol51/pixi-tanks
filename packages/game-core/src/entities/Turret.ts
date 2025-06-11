import { Graphics } from "pixi.js";

export class Turret extends Graphics {
  constructor() {
    super();
    this.drawTurret();
  }

  private drawTurret() {
    this.clear();
    this.rect(0, -4, 30, 8).fill(0x0066ff); // barrel
    // this.pivot.set(-10, -15);
  }

  aimAt(angle: number) {
    this.rotation = angle;
  }
}
