import { useEffect } from "react";
import { gameEvents } from "@pixi-tanks/game-core";
import { useGameStore } from "@/store/gameStore";
import { useScoreStore } from "@/store/scoreStore";

export const useGameEvents = () => {
  const setScores = useScoreStore((s) => s.setScores);
  const die = useGameStore((s) => s.die);

  useEffect(() => {
    gameEvents.on("scoreUpdate", setScores);
    gameEvents.on("playerDied", die); // 👈 New event listener

    return () => {
      gameEvents.off("scoreUpdate", setScores);
      gameEvents.off("playerDied", die);
    };
  }, [setScores, die]);
};
