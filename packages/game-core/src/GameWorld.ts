import { Application, Container } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Tank } from "./entities/Tank";
import { Bullet } from "./entities/Bullet";
import { Grid } from "./entities/Grid";

export class GameWorld {
  app: Application;
  viewport: Viewport;
  tanks: Map<string, Tank> = new Map();
  bullets: Bullet[] = [];

  constructor(app: Application) {
    this.app = app;

    this.viewport = new Viewport({
      screenWidth: app.screen.width,
      screenHeight: app.screen.height,
      worldWidth: 2000,
      worldHeight: 2000,
      events: app.renderer.events,
    });

    // 1️⃣ Add grid first so it renders behind other elements
    const grid = new Grid(2000, 2000, 50, 0x444444);
    this.viewport.addChild(grid);

    // 2️⃣ Enable interactivity and camera movement
    this.viewport
      .clamp({ direction: "all" })
      .wheel({ smooth: 3, percent: 0.1 })
      .decelerate();

    app.stage.addChild(this.viewport);
  }

  spawnTank(id: string, name: string) {
    const tank = new Tank(id, name);
    tank.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    this.viewport.addChild(tank);
    this.tanks.set(id, tank);
  }

  fireBullet(tankId: string) {
    const tank = this.tanks.get(tankId);
    if (!tank) return;

    const angle = tank.turret.rotation + tank.rotation;

    // Tip of the turret — 30px forward in the direction of turret
    const offsetX = Math.cos(angle) * 30;
    const offsetY = Math.sin(angle) * 30;
    const bullet = new Bullet(
      tank.position.x + offsetX,
      tank.position.y + offsetY,
      angle
    );

    this.bullets.push(bullet);
    this.viewport.addChild(bullet);
  }

  update(delta: number) {
    this.tanks.forEach((tank) => tank.update(delta));

    // Update bullets
    this.bullets.forEach((b) => b.update(delta));

    // Remove expired bullets
    this.bullets = this.bullets.filter((b) => {
      if (b.isExpired()) {
        this.viewport.removeChild(b);
        return false;
      }
      return true;
    });
  }
}
