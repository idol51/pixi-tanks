import { GameMode, createBotManagerForMode } from "./GameMode";
import { spawnShapesInArena } from "../utils/arenaSpawner";

const botManager = createBotManagerForMode("ffa");

export const ffaMode: GameMode = {
  id: "ffa",
  label: "FFA with Bots",
  description:
    "Free-for-all against AI bots. Respawn and climb the leaderboard.",
  onInit(world) {
    spawnShapesInArena(world.getEntityManager(), world.getViewport());
    world.spawnPlayer("player");
    botManager.update(world.getEntityManager(), world.getViewport());
  },
  onUpdate(world) {
    botManager.update(world.getEntityManager(), world.getViewport());
  },
  shouldRespawnPlayer: () => true,
  getBotManager: () => botManager,
};
