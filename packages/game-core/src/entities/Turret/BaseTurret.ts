import { Container, FillInput, Graphics } from "pixi.js";
import { BaseTank } from "../Tank/base-tank";
import { Bullet } from "../Bullet/Bullet";

export abstract class BaseTurret extends Container {
  protected lastFiredAt: number = 0;
  protected graphics: Graphics = new Graphics();
  protected cooldown: number;
  protected turretColor: FillInput = 0x000000;

  constructor() {
    super();

    this.draw();
    this.addChild(this.graphics);

    this.position.set(0, 0);
    this.zIndex = 300;
  }

  abstract draw(): void;

  /**
   * Called to fire bullets from the turret. Should return an array of bullets.
   */
  abstract fire(tank: BaseTank): Bullet[];

  /**
   * Aim the turret at a given angle (relative to tank body).
   */
  abstract aimAt(angle: number): void;
}
