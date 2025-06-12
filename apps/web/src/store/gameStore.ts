// apps/web/src/store/gameStore.ts
import { create } from "zustand";

type GameState = {
  started: boolean;
  playerName: string;
  isAlive: boolean;
  setPlayerName: (name: string) => void;
  startGame: () => void;
  die: () => void;
  respawn: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  started: false,
  playerName: "",
  isAlive: true,
  setPlayerName: (name) => set({ playerName: name }),
  startGame: () => set({ started: true, isAlive: true }),
  die: () => set({ isAlive: false }),
  respawn: () => set({ isAlive: true }),
}));
