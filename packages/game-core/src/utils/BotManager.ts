import { EntityManager } from "../ecs/EntityManager";
import { Viewport } from "pixi-viewport";
import { spawnTank } from "../factories/TankFactory";
import { getClassName } from "../data/tank-classes";
import { SpawnZone } from "../data/world";
import { pickSpawnPoint } from "./pickSpawnPoint";
import {
  pickBotClassForFfa,
  pickBotClassForWave,
  pickBossClass,
  isBossWave,
} from "../data/botClassPresets";

export type BotManagerConfig = {
  targetCount: number;
  spawnZone: SpawnZone;
  teamId?: string;
  wave?: number;
  modeId?: "ffa" | "survival" | "team";
};

export class BotManager {
  private botIndex = 0;
  private config: BotManagerConfig;

  constructor(config: BotManagerConfig) {
    this.config = config;
  }

  update(em: EntityManager, viewport: Viewport) {
    const aiEntities = em.queryByComponents("AIController", "PhysicsBody");
    const needed = this.config.targetCount - aiEntities.length;

    for (let i = 0; i < needed; i++) {
      this.spawnBot(em, viewport);
    }
  }

  spawnBoss(em: EntityManager, viewport: Viewport) {
    const classId = pickBossClass();
    const { x, y } = pickSpawnPoint(em, this.config.spawnZone, {
      minDist: 120,
    });
    this.botIndex += 1;
    const stats = spawnTank({
      id: `bot-boss-${this.botIndex}`,
      em,
      viewport,
      x,
      y,
      isAI: true,
      teamId: this.config.teamId,
      displayName: `Boss ${getClassName(classId)}`,
      tankClassId: classId,
      aiTier: 3,
    });
    const health = stats.getComponent("Health");
    if (health) {
      health.max = Math.floor(health.max * 1.5);
      health.current = health.max;
    }
    return stats;
  }

  private spawnBot(em: EntityManager, viewport: Viewport) {
    this.botIndex += 1;
    const wave = this.config.wave ?? 1;
    const classId =
      this.config.modeId === "survival"
        ? pickBotClassForWave(wave)
        : pickBotClassForFfa(this.botIndex);

    const { x, y } = pickSpawnPoint(em, this.config.spawnZone, {
      minDist: 100,
    });

    spawnTank({
      id: `bot-${this.botIndex}`,
      em,
      viewport,
      x,
      y,
      isAI: true,
      teamId: this.config.teamId,
      displayName: getClassName(classId),
      tankClassId: classId,
      aiTier: wave <= 2 ? 1 : wave <= 4 ? 2 : 3,
    });
  }

  setTargetCount(count: number) {
    this.config.targetCount = count;
  }

  setWave(wave: number) {
    this.config.wave = wave;
  }

  getWave() {
    return this.config.wave ?? 1;
  }

  shouldSpawnBoss() {
    return (
      this.config.modeId === "survival" &&
      isBossWave(this.config.wave ?? 1)
    );
  }
}
