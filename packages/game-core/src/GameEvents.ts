// packages/game-core/src/GameEvents.ts
import mitt from "mitt";

type Events = {
  playerPos: { x: number; y: number };
  scoreUpdate: { id: string; name: string; score: number }[];
  playerDied: void;
};

export const gameEvents = mitt<Events>();
