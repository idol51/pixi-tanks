import { Container, FillInput, Graphics } from "pixi.js";
import { BulletFactory, BulletType } from "../../factories/BulletFactory";
import { Bullet } from "../Bullet/Bullet";

// This class represents a turret that can aim and fire bullets.
// It extends PIXI.Container to allow for easy integration into the game scene.
export class Turret extends Container {
  private graphics: Graphics;
  protected lastFiredAt: number = 0;
  private cooldown: number;
  private bulletType: BulletType;

  constructor(color: FillInput, cooldown: number, type: BulletType) {
    super();

    this.bulletType = type;

    this.cooldown = cooldown; // milliseconds
    this.graphics = new Graphics();
    this.draw(color);
    this.addChild(this.graphics);

    this.position.set(0, 0);
    this.zIndex = 300;
  }

  private draw(color: FillInput) {
    this.graphics.clear();
    this.graphics.rect(0, -4, 30, 8).fill(color);
  }

  aimAt(angle: number) {
    this.rotation = angle;
  }

  setBulletType(type: BulletType) {
    this.bulletType = type;
  }

  fire(
    owner: { position: { x: number; y: number }; id: string; rotation: number },
    overrideAngle?: number
  ): Bullet | null {
    const now = performance.now();

    if (now - this.lastFiredAt < this.cooldown) {
      return null; // Still cooling down
    }

    this.lastFiredAt = now;

    const angle = (overrideAngle ?? 0) + owner.rotation + this.rotation;
    const offsetX = Math.cos(angle) * 30;
    const offsetY = Math.sin(angle) * 30;

    const spawnX = owner.position.x + offsetX;
    const spawnY = owner.position.y + offsetY;

    return BulletFactory.create(
      this.bulletType,
      spawnX,
      spawnY,
      angle,
      owner.id
    );
  }

  setCooldown(ms: number) {
    this.cooldown = ms;
  }

  getCooldown(): number {
    return this.cooldown;
  }

  setColor(color: number) {
    this.draw(color);
  }
}
