// packages/game-core/src/entities/Tank/BaseTank.ts
import { Graphics, Point, Container, Text, FillInput } from "pixi.js";
import { Turret } from "../Turret/Turret";
import { TankStats } from "../../data/tank-stats";
import { ITank } from "./ITank";
import { TankComponent } from "./TankComponent";
import { HealthComponent } from "./components/HealthComponent";
import { WORLD_BOUNDS } from "../../data/world";

export abstract class BaseTank extends Container implements ITank {
  id: string;
  name: string;
  velocity = { x: 0, y: 0 };
  health: number;
  maxHealth: number;
  score = 0;
  tags = new Set<string>();
  color: FillInput;

  protected stats: TankStats;

  // Rendering
  protected body: Graphics;
  protected nameText: Text;
  public turret!: Turret;
  protected healthBar: HealthComponent;
  // Component system
  private components: TankComponent[] = [];

  constructor(id: string, name: string, color: FillInput, stats: TankStats) {
    super();
    this.id = id;
    this.name = name;
    this.color = color;
    this.stats = stats;
    this.health = stats.tankHealth;
    this.maxHealth = stats.tankHealth;

    this.position = new Point(0, 0);
    this.rotation = 0;

    this.healthBar = new HealthComponent();
    this.healthBar.onAttach(this);

    // Visuals
    this.body = this.createBody();
    this.nameText = this.createNameText();

    this.addChild(this.body, this.nameText);
  }

  // Public API
  update(delta: number) {
    for (const c of this.components) c.update(delta, this);

    this.healthBar.update(delta, this);

    // Movement
    this.position.x += this.velocity.x * delta * this.stats.tankSpeed;
    this.position.y += this.velocity.y * delta * this.stats.tankSpeed;

    const radius = this.stats.tankSize;
    this.position.x = Math.max(
      radius,
      Math.min(WORLD_BOUNDS.width - radius, this.position.x)
    );
    this.position.y = Math.max(
      radius,
      Math.min(WORLD_BOUNDS.height - radius, this.position.y)
    );

    this.nameText.position.set(0, 0);
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

  aimTurret(angle: number) {
    this.turret.aimAt(angle - this.rotation);
  }

  takeDamage(amount: number) {
    this.health = Math.max(0, this.health - amount);
  }

  isAlive() {
    return this.health > 0;
  }

  getRotationAngle() {
    return this.rotation;
  }

  getStats(): TankStats {
    return this.stats;
  }

  // Component Lifecycle
  addComponent(component: TankComponent) {
    this.components.push(component);
    if (component.onAttach) {
      component.onAttach(this); // Ensures visuals like health bar get added
    }
  }

  removeComponent(component: TankComponent) {
    this.components = this.components.filter((c) => c !== component);
  }

  getComponents(): TankComponent[] {
    return this.components;
  }

  // Rendering Helpers
  protected createBody() {
    const g = new Graphics();
    g.circle(0, 0, this.stats.tankSize).fill(this.color);
    g.zIndex = 200;
    return g;
  }

  protected createNameText() {
    return new Text({
      text: this.name,
      style: {
        fontFamily: "Arial",
        fontSize: 12,
        fill: "white",
        align: "center",
      },
      anchor: { x: 0.5, y: -1.8 },
    });
  }
}
