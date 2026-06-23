import { GameMode, createBotManagerForMode } from "./GameMode";
import { spawnShapesInArena } from "../utils/arenaSpawner";
import { gameEvents } from "../GameEvents";

let wave = 1;
let waveTimer = 0;
let waveState: "active" | "cleared" | "incoming" = "active";
let botManager = createBotManagerForMode("survival", wave);

const WAVE_CLEAR_DELAY_MS = 3000;
const WAVE_INCOMING_MS = 1500;

function emitWaveUpdate(countdownMs?: number) {
  gameEvents.emit("waveUpdate", {
    wave,
    state: waveState,
    countdownMs,
  });
}

export const survivalMode: GameMode = {
  id: "survival",
  label: "Survival Waves",
  description: "Survive escalating bot waves. No respawn.",
  onInit(world) {
    wave = 1;
    waveTimer = 0;
    waveState = "active";
    botManager = createBotManagerForMode("survival", wave);
    spawnShapesInArena(world.getEntityManager(), world.getViewport());
    world.spawnPlayer("player");
    botManager.update(world.getEntityManager(), world.getViewport());
    if (botManager.shouldSpawnBoss()) {
      botManager.spawnBoss(world.getEntityManager(), world.getViewport());
    }
    emitWaveUpdate();
  },
  onUpdate(world, delta) {
    const em = world.getEntityManager();
    if (waveState === "active") {
      botManager.update(em, world.getViewport());
    }
    const enemies = em
      .queryByComponents("AIController", "PhysicsBody")
      .filter((e) => e.getComponent("Collision")?.config.teamId === "enemy");

    if (enemies.length === 0 && waveState === "active") {
      waveState = "cleared";
      waveTimer = 0;
      emitWaveUpdate(WAVE_CLEAR_DELAY_MS);
    }

    if (waveState === "cleared") {
      waveTimer += delta;
      const remaining = Math.max(0, WAVE_CLEAR_DELAY_MS - waveTimer);
      emitWaveUpdate(remaining);

      if (waveTimer >= WAVE_CLEAR_DELAY_MS) {
        wave += 1;
        waveTimer = 0;
        waveState = "incoming";
        emitWaveUpdate(WAVE_INCOMING_MS);
      }
      return;
    }

    if (waveState === "incoming") {
      waveTimer += delta;
      const remaining = Math.max(0, WAVE_INCOMING_MS - waveTimer);
      emitWaveUpdate(remaining);

      if (waveTimer >= WAVE_INCOMING_MS) {
        waveTimer = 0;
        waveState = "active";
        botManager = createBotManagerForMode("survival", wave);
        spawnShapesInArena(em, world.getViewport(), 10);
        botManager.update(em, world.getViewport());
        if (botManager.shouldSpawnBoss()) {
          botManager.spawnBoss(em, world.getViewport());
        }
        emitWaveUpdate();
      }
    }
  },
  shouldRespawnPlayer: () => false,
  getBotManager: () => botManager,
};

export function getSurvivalWave() {
  return wave;
}

export function getSurvivalWaveState() {
  return waveState;
}
