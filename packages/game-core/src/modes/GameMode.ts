import { GameWorld } from "../GameWorld";
import { Entity } from "../ecs/Entity";
import { BotManager } from "../utils/BotManager";

export type GameModeId = "ffa" | "survival" | "team";

export interface GameMode {
  id: GameModeId;
  label: string;
  description: string;
  onInit(world: GameWorld): void;
  onUpdate(world: GameWorld, delta: number): void;
  onEntityDeath?(world: GameWorld, entity: Entity): void;
  shouldRespawnPlayer(): boolean;
  getBotManager(): BotManager | null;
}

export function createBotManagerForMode(
  modeId: GameModeId,
  wave = 1
): BotManager {
  switch (modeId) {
    case "survival":
      return new BotManager({
        targetCount: 3 + wave * 2,
        spawnZone: "corner",
        teamId: "enemy",
        wave,
        modeId: "survival",
      });
    case "team":
      return new BotManager({
        targetCount: 6,
        spawnZone: "corner",
        teamId: "enemy",
        wave,
        modeId: "team",
      });
    case "ffa":
    default:
      return new BotManager({
        targetCount: 10,
        spawnZone: "edge",
        teamId: undefined,
        wave,
        modeId: "ffa",
      });
  }
}
