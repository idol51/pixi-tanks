import { Container, FillInput, Graphics, Point } from "pixi.js";
import { Bullet } from "./Bullet";
import { BulletStats } from "../../data/tank-stats";

export abstract class BaseBullet extends Container {
  id: string;
  ownerId: string;
  speed: number;
  velocity: Point;
  acceleration: number = 0;
  damage: number;
  radius: number;
  lifetime: number;
  age: number = 0;
  color: FillInput;
  graphics: Graphics = new Graphics();

  constructor(
    x: number,
    y: number,
    angle: number,
    id: string,
    ownerId: string,
    color: FillInput,
    stats: BulletStats
  ) {
    super();
    this.id = id;
    this.ownerId = ownerId;
    this.color = color;
    this.speed = stats.bulletSpeed;
    this.damage = stats.bulletDamage;
    this.radius = stats.bulletRadius;
    this.lifetime = stats.bulletLifetime;
    this.acceleration = stats.bulletAcceleration || 0;
    this.position.set(x, y);
    this.velocity = new Point(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );

    this.draw();
    this.addChild(this.graphics);
  }

  abstract draw(): void;

  abstract update(delta: number): void;

  isExpired(): boolean {
    return this.age >= this.lifetime;
  }
}
