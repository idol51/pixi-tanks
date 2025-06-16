import { Container, FillInput, Graphics } from "pixi.js";
import { BaseTank } from "../Tank/base-tank";
import { Bullet } from "../Bullet/Bullet";

export abstract class BaseTurret extends Container {
  protected owner: BaseTank;
  protected lastFiredAt: number = 0;
  protected graphics: Graphics = new Graphics();
  protected turretColor: FillInput = 0x888888;

  constructor(owner: BaseTank) {
    super();
    this.owner = owner;

    this.draw();
    this.addChild(this.graphics);

    this.position.set(0, 0);
    this.zIndex = 500;
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
