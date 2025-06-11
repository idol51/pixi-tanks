// packages/game-core/src/entities/Tank.ts
import { Graphics, Point, Container } from "pixi.js";
import { ITank } from "./ITank";
import { Turret } from "./Turret";

export class Tank extends Container implements ITank {
  id: string;
  name: string;
  velocity = { x: 0, y: 0 };
  health = 100;
  maxHealth = 100;
  score = 0;

  private body: Graphics;
  public turret: Turret;

  constructor(id: string, name: string) {
    super();
    this.id = id;
    this.name = name;
    this.position = new Point(0, 0);
    this.rotation = 0;

    this.turret = new Turret();
    this.body = this.createBody();

    this.addChild(this.body);
    this.addChild(this.turret);
  }

  private createBody() {
    const g = new Graphics();
    g.circle(0, 0, 20).fill(0x00ffcc);
    g.zIndex = 200;
    return g;
  }

  update(delta: number) {
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
  }

  move(direction: { x: number; y: number }) {
    this.velocity = direction;
  }

  rotate(angle: number) {
    this.rotation = angle;
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
