// packages/game-core/src/GameEvents.ts
import mitt from "mitt";

type Events = {
  scoreUpdate: { id: string; name: string; score: number }[];
  playerDied: void;
};

export const gameEvents = mitt<Events>();
