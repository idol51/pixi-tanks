import { GameMode, createBotManagerForMode } from "./GameMode";
import { spawnShapesInArena } from "../utils/arenaSpawner";
import { spawnTank } from "../factories/TankFactory";
import { randomInZone } from "../data/world";

const botManager = createBotManagerForMode("team");
let alliesSpawned = false;

export const teamMode: GameMode = {
  id: "team",
  label: "Team vs Bots",
  description: "Fight alongside ally bots against the enemy team.",
  onInit(world) {
    alliesSpawned = false;
    spawnShapesInArena(world.getEntityManager(), world.getViewport());
    world.spawnPlayer("ally");
    botManager.update(world.getEntityManager(), world.getViewport());

    if (!alliesSpawned) {
      for (let i = 0; i < 3; i++) {
        const { x, y } = randomInZone("playerStart");
        spawnTank({
          id: `ally-${i + 1}`,
          em: world.getEntityManager(),
          viewport: world.getViewport(),
          x: x + i * 60,
          y: y + 80,
          isAI: true,
          teamId: "ally",
          displayName: `Ally ${i + 1}`,
          statsKey: "DEFAULT",
          options: { color: 0x4488ff },
        });
      }
      alliesSpawned = true;
    }
  },
  onUpdate(world) {
    botManager.update(world.getEntityManager(), world.getViewport());
  },
  shouldRespawnPlayer: () => true,
  getBotManager: () => botManager,
};
