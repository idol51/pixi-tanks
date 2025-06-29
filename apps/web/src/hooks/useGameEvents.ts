import { useEffect } from "react";
import { gameEvents } from "@pixi-tanks/game-core";
import { useGameStore } from "@/store/gameStore";
import { useScoreStore } from "@/store/scoreStore";

export const useGameEvents = () => {
  const setScores = useScoreStore((s) => s.setScores);
  const die = useGameStore((s) => s.die);
  const setPlayerPos = useGameStore((s) => s.setPlayerPos);

  useEffect(() => {
    gameEvents.on("scoreUpdate", setScores);
    gameEvents.on("playerDied", die); // 👈 New event listener
    gameEvents.on("playerPos", setPlayerPos);

    return () => {
      gameEvents.off("scoreUpdate", setScores);
      gameEvents.off("playerDied", die);
      gameEvents.off("playerPos", setPlayerPos);
    };
  }, [setScores, die, setPlayerPos]);
};
