import { Application, Container } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Tank } from "./entities/Tank";
import { Bullet } from "./entities/Bullet";
import { Grid } from "./entities/Grid";
import { v4 as uuid } from "uuid";
import { AIController } from "./entities/AIController";

export class GameWorld {
  app: Application;
  viewport: Viewport;
  tanks: Map<string, Tank> = new Map();
  bullets: Map<string, Bullet> = new Map();
  playerId: string;
  lastEnemySpawn: number;

  private aiControllers: AIController[] = [];

  constructor(app: Application, viewport: Viewport, playerId: string) {
    this.app = app;
    this.playerId = playerId;
    this.viewport = viewport;

    // 1️⃣ Add grid first so it renders behind other elements
    const grid = new Grid(2000, 2000, 50, 0x444444);
    viewport.addChild(grid);

    // 2️⃣ Enable interactivity and camera movement
    viewport
      .drag()
      .clamp({ direction: "all" })
      .wheel({ smooth: 3, percent: 0.1 })
      .decelerate();

    app.stage.addChild(viewport);
  }

  spawnTank(id: string, name: string) {
    const tank = new Tank(id, name);
    tank.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    this.viewport.addChild(tank);
    this.tanks.set(id, tank);
  }

  spawnEnemy(id: string) {
    const tank = new Tank(id, "Enemy");
    tank.position.set(Math.random() * 1000, Math.random() * 1000);
    this.viewport.addChild(tank);
    this.tanks.set(id, tank);

    const ai = new AIController(tank);
    this.aiControllers.push(ai);
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
      angle,
      tankId
    );

    const bulletId = uuid();

    this.bullets.set(bulletId, bullet);
    this.viewport.addChild(bullet);
  }

  update(delta: number) {
    this.tanks.forEach((tank) => tank.update(delta));

    // Update bullets
    this.bullets.forEach((b) => b.update(delta));

    this.bullets.forEach((bullet, bulletId) => {
      bullet.update(delta);

      if (bullet.isExpired()) {
        this.bullets.delete(bulletId);
        this.viewport.removeChild(bullet);
      }

      for (const [tankId, tank] of Array.from(this.tanks)) {
        if (tankId === bullet.ownerId || !tank.isAlive()) continue;

        const dx = bullet.position.x - tank.position.x;
        const dy = bullet.position.y - tank.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 20) {
          tank.takeDamage(bullet.damage);
          this.bullets.delete(bulletId);
          this.viewport.removeChild(bullet);
          break;
        }
      }
    });

    const player = this.tanks.get(this.playerId); // Add `playerId` in constructor

    this.aiControllers.forEach((ai) => {
      ai.update(player, (angle) => {
        const bullet = new Bullet(
          ai.tank.position.x + Math.cos(angle) * 30,
          ai.tank.position.y + Math.sin(angle) * 30,
          angle,
          ai.tank.id
        );
        const bulletId = uuid();
        this.bullets.set(bulletId, bullet);
        this.viewport.addChild(bullet);
      });
    });

    if (
      this.tanks.size < 10 &&
      performance.now() - this.lastEnemySpawn > 3000
    ) {
      this.spawnEnemy(`AI-${Date.now()}`);
      this.lastEnemySpawn = performance.now();
    }

    const playerTank = this.tanks.get(this.playerId);
    if (playerTank) {
      this.viewport.moveCenter(playerTank.position.x, playerTank.position.y);
    }
  }
}
