import { Application } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { BaseTank } from "./entities/Tank/base-tank";
import { Grid } from "./entities/Grid";
import { v4 as uuid } from "uuid";
import { gameEvents } from "./GameEvents";
import { ITank } from "./entities/Tank/ITank";
import { Bullet } from "./entities/Bullet/Bullet";
import { TankFactory, TankVariant } from "./factories/TankFactory";
import { EnemySpawner } from "./systems/EnemySpawner";

export class GameWorld {
  app: Application;
  viewport: Viewport;
  tanks: Map<string, BaseTank> = new Map();
  bullets: Map<string, Bullet> = new Map();
  playerId: string;
  private enemySpawner: EnemySpawner;

  constructor(app: Application, viewport: Viewport, playerId: string) {
    this.app = app;
    this.playerId = playerId;
    this.viewport = viewport;

    const grid = new Grid(2000, 2000, 50, 0x444444);
    viewport.addChild(grid);

    viewport.drag().decelerate();

    app.stage.addChild(viewport);
    this.enemySpawner = new EnemySpawner(this);
  }

  spawnTank(id: string, name: string) {
    const tank = TankFactory.createTank(TankVariant.MISSILE_LAUNCHER, name);
    tank.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    this.viewport.addChild(tank);
    this.tanks.set(id, tank);
  }

  fireBullet(tankId: string) {
    const tank = this.tanks.get(tankId);
    if (!tank || !tank.isAlive()) return;

    const bullet = tank.turret.fire(tank);
    if (!bullet) return;

    const bulletId = uuid();
    this.bullets.set(bulletId, bullet);
    this.viewport.addChild(bullet);
  }

  private checkCollision(bullet: Bullet, tank: ITank): boolean {
    const dx = bullet.position.x - tank.position.x;
    const dy = bullet.position.y - tank.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const bulletRadius = bullet.radius ?? 4;
    const tankRadius = 20;

    return distance < bulletRadius + tankRadius;
  }

  getPlayerScore() {
    const playerTank = this.tanks.get(this.playerId);
    return playerTank?.score ?? 0;
  }

  updateLeaderboard() {
    const scores = Array.from(this.tanks.values())
      .map((tank) => ({
        id: tank.id,
        name: tank.name,
        score: tank.score,
      }))
      .sort((a, b) => b.score - a.score);

    gameEvents.emit("scoreUpdate", scores);
  }

  update(delta: number) {
    for (const [id, tank] of Array.from(this.tanks)) {
      tank.update(delta);

      if (!tank.isAlive()) {
        this.viewport.removeChild(tank);
        this.tanks.delete(id);

        if (id === this.playerId) {
          gameEvents.emit("playerDied");
        }
      }
    }

    for (const [bulletId, bullet] of Array.from(this.bullets)) {
      bullet.update(delta);

      if (bullet.isExpired()) {
        this.bullets.delete(bulletId);
        this.viewport.removeChild(bullet);
        continue;
      }

      for (const [tankId, tank] of Array.from(this.tanks)) {
        if (tankId === bullet.ownerId) continue;

        if (this.checkCollision(bullet, tank)) {
          tank.takeDamage(bullet.damage);

          const shooter = this.tanks.get(bullet.ownerId);
          if (shooter && !tank.isAlive()) {
            shooter.score += 100;
          }

          this.bullets.delete(bulletId);
          this.viewport.removeChild(bullet);
          break;
        }
      }
    }

    const player = this.tanks.get(this.playerId);

    if (player) {
      this.viewport.moveCenter(player.position.x, player.position.y);
    }

    this.enemySpawner.update(delta);

    this.updateLeaderboard();
  }
}
