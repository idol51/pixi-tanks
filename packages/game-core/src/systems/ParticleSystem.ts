import { Graphics, Container } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { EntityManager } from "../ecs/EntityManager";
import { System } from "../ecs/System";
import { gameEvents } from "../GameEvents";

type Particle = {
  gfx: Graphics;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
};

export type BurstOptions = {
  count?: number;
  color?: number;
  speed?: number;
  lifeMs?: number;
  size?: number;
};

export class ParticleSystem extends System {
  private container: Container;
  private particles: Particle[] = [];

  constructor(viewport: Viewport) {
    super();
    this.container = new Container();
    this.container.zIndex = 2000000;
    viewport.addChild(this.container);
    gameEvents.on("combatFx", this.handleCombatFx);
  }

  destroy() {
    gameEvents.off("combatFx", this.handleCombatFx);
    for (const p of this.particles) {
      p.gfx.destroy();
    }
    this.particles = [];
    this.container.destroy({ children: true });
  }

  private handleCombatFx = (data: {
    type: string;
    x: number;
    y: number;
    color?: number;
  }) => {
    if (data.x === 0 && data.y === 0) return;

    const color = data.color ?? 0xffffff;
    switch (data.type) {
      case "shoot":
        this.spawnBurst(data.x, data.y, {
          count: 3,
          color,
          speed: 2,
          lifeMs: 120,
          size: 2,
        });
        break;
      case "hit":
        this.spawnBurst(data.x, data.y, {
          count: 6,
          color: 0xffaa44,
          speed: 4,
          lifeMs: 200,
          size: 3,
        });
        break;
      case "death":
        this.spawnBurst(data.x, data.y, {
          count: 14,
          color,
          speed: 6,
          lifeMs: 400,
          size: 4,
        });
        break;
      case "evolve":
        this.spawnBurst(data.x, data.y, {
          count: 20,
          color: 0xffff88,
          speed: 5,
          lifeMs: 500,
          size: 5,
        });
        break;
    }
  };

  spawnBurst(x: number, y: number, opts: BurstOptions = {}) {
    const {
      count = 8,
      color = 0xffffff,
      speed = 4,
      lifeMs = 300,
      size = 3,
    } = opts;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const spd = speed * (0.5 + Math.random());
      const gfx = new Graphics().circle(0, 0, size).fill(color);
      gfx.position.set(x, y);
      this.container.addChild(gfx);
      this.particles.push({
        gfx,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: lifeMs,
        maxLife: lifeMs,
      });
    }
  }

  update(_manager: EntityManager, delta = 16): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= delta;
      if (p.life <= 0) {
        this.container.removeChild(p.gfx);
        p.gfx.destroy();
        this.particles.splice(i, 1);
        continue;
      }
      p.gfx.x += p.vx;
      p.gfx.y += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.gfx.alpha = p.life / p.maxLife;
    }
  }
}
