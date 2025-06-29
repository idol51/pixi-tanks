// apps/web/src/store/gameStore.ts
import { create } from "zustand";

type GameState = {
  started: boolean;
  playerName: string;
  playerPos: { x: number; y: number };
  isAlive: boolean;
  setPlayerPos: (pos: { x: number; y: number }) => void;
  setPlayerName: (name: string) => void;
  startGame: () => void;
  die: () => void;
  respawn: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  started: false,
  playerName: "",
  playerPos: { x: 0, y: 0 },
  isAlive: true,
  setPlayerPos: (pos) => set({ playerPos: pos }),
  setPlayerName: (name) => set({ playerName: name }),
  startGame: () => set({ started: true, isAlive: true }),
  die: () => set({ isAlive: false }),
  respawn: () => set({ isAlive: true }),
}));
