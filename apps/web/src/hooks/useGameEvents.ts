import { useEffect } from "react";
import { gameEvents } from "@pixi-tanks/game-core";
import { useGameStore } from "@/store/gameStore";
import { useScoreStore } from "@/store/scoreStore";
import { playSfx } from "@/utils/sfx";

function isPlayerCombatFx(data: {
  type: string;
  sourceId?: string;
  targetId?: string;
}) {
  if (data.type === "evolve") return true;
  return data.sourceId === "player" || data.targetId === "player";
}

export const useGameEvents = () => {
  const setScores = useScoreStore((s) => s.setScores);
  const die = useGameStore((s) => s.die);
  const setPlayerPos = useGameStore((s) => s.setPlayerPos);
  const setHud = useGameStore((s) => s.setHud);
  const setClassEvolution = useGameStore((s) => s.setClassEvolution);
  const setWaveState = useGameStore((s) => s.setWaveState);
  const pushKillFeed = useGameStore((s) => s.pushKillFeed);

  useEffect(() => {
    const onStatPointGained = () => {
      const { reduceMotion, soundEnabled } = useGameStore.getState().settings;
      if (!reduceMotion && soundEnabled) playSfx("levelUp");
    };
    const onClassEvolution = ({
      level,
      choices,
    }: {
      level: number;
      choices: NonNullable<Parameters<typeof setClassEvolution>[0]>["choices"];
    }) => {
      setClassEvolution({ level, choices });
      const { reduceMotion, soundEnabled } = useGameStore.getState().settings;
      if (!reduceMotion && soundEnabled) playSfx("levelUp");
    };
    const onHudUpdate = (hud: Parameters<typeof setHud>[0]) => {
      setHud(hud);
      if (!hud.pendingClassEvolution) {
        setClassEvolution(null);
      }
    };
    const onCombatFx = (data: {
      type: string;
      sourceId?: string;
      targetId?: string;
    }) => {
      const { reduceMotion, soundEnabled } = useGameStore.getState().settings;
      if (reduceMotion || !soundEnabled) return;
      if (!isPlayerCombatFx(data)) return;
      if (data.type === "shoot") playSfx("shoot");
      if (data.type === "hit") playSfx("hit");
      if (data.type === "death") playSfx("death");
      if (data.type === "evolve") playSfx("evolve");
    };
    const onWaveUpdate = (data: {
      wave: number;
      state: "active" | "cleared" | "incoming";
      countdownMs?: number;
    }) => setWaveState(data);

    gameEvents.on("scoreUpdate", setScores);
    gameEvents.on("playerDied", die);
    gameEvents.on("playerPos", setPlayerPos);
    gameEvents.on("hudUpdate", onHudUpdate);
    gameEvents.on("statPointGained", onStatPointGained);
    gameEvents.on("classEvolution", onClassEvolution);
    gameEvents.on("combatFx", onCombatFx);
    gameEvents.on("waveUpdate", onWaveUpdate);
    gameEvents.on("killFeed", ({ message }) => pushKillFeed(message));

    return () => {
      gameEvents.off("scoreUpdate", setScores);
      gameEvents.off("playerDied", die);
      gameEvents.off("playerPos", setPlayerPos);
      gameEvents.off("hudUpdate", onHudUpdate);
      gameEvents.off("statPointGained", onStatPointGained);
      gameEvents.off("classEvolution", onClassEvolution);
      gameEvents.off("combatFx", onCombatFx);
      gameEvents.off("waveUpdate", onWaveUpdate);
      gameEvents.off("killFeed", ({ message }) => pushKillFeed(message));
    };
  }, [
    setScores,
    die,
    setPlayerPos,
    setHud,
    setClassEvolution,
    setWaveState,
    pushKillFeed,
  ]);
};
