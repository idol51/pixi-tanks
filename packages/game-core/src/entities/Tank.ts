import { Graphics, Point, Container, Text } from "pixi.js";
import { ITank } from "./ITank";
import { Turret } from "./Turret";

export const TankType = {
  PLAYER: "player",
  AI: "ai",
} as const;

export type TankType = (typeof TankType)[keyof typeof TankType];

export class Tank extends Container implements ITank {
  id: string;
  name: string;
  type: TankType;
  velocity = { x: 0, y: 0 };
  health = 100;
  maxHealth = 100;
  score = 0;

  private nameText: Text;
  private body: Graphics;
  public turret: Turret;
  private healthBar: Graphics;

  constructor(id: string, name: string, type: TankType = TankType.AI) {
    super();
    this.id = id;
    this.name = name;
    this.type = type;
    this.position = new Point(0, 0);
    this.rotation = 0;

    this.turret = new Turret();
    this.body = this.createBody();
    this.nameText = this.createNameText();

    this.addChild(this.body);
    this.addChild(this.turret);
    this.addChild(this.nameText);
  }

  private createBody() {
    const g = new Graphics();

    const color = this.type === TankType.PLAYER ? 0x00ffcc : 0xff6666;
    g.circle(0, 0, 20).fill(color);
    g.zIndex = 200;

    this.healthBar = new Graphics();
    this.addChild(this.healthBar);
    this.updateHealthBar();
    return g;
  }

  private createNameText() {
    const text = new Text({
      text: this.name,
      style: {
        fontFamily: "Arial",
        fontSize: 12,
        fill: "white",
        align: "center",
      },
      anchor: { x: 0.5, y: -1.8 },
    });
    return text;
  }

  private updateHealthBar() {
    this.healthBar.clear();

    // Hide if at full health
    if (this.health === this.maxHealth) return;

    const barWidth = 40;
    const barHeight = 6;
    const x = -barWidth / 2;
    const y = -30;

    const healthRatio = this.health / this.maxHealth;

    // Background (red)
    this.healthBar.rect(x, y, barWidth, barHeight).fill(0xff0000);

    // Foreground (green)
    this.healthBar.rect(x, y, barWidth * healthRatio, barHeight).fill(0x00ff00);
  }

  update(delta: number) {
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;

    this.nameText.position.set(0, 0);
    if (this.health !== this.maxHealth) this.updateHealthBar();
  }

  move(direction: { x: number; y: number }) {
    this.velocity = direction;
  }

  stop() {
    this.velocity = { x: 0, y: 0 };
  }

  rotate(angle: number) {
    this.rotation = angle;
  }

  getRotationAngle() {
    return this.rotation;
  }

  aimTurret(angle: number) {
    this.turret.aimAt(angle - this.rotation); // adjust for tank rotation
  }

  takeDamage(amount: number) {
    this.health = Math.max(0, this.health - amount);
  }

  isAlive() {
    return this.health > 0;
  }
}
