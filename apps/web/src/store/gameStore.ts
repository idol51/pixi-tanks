import { create } from "zustand";
import type {
  GameModeId,
  TankClassId,
  UpgradeableStat,
} from "@pixi-tanks/game-core";
import { createEmptyAllocations } from "@pixi-tanks/game-core";

export type HudState = {
  health: number;
  maxHealth: number;
  xp: number;
  xpToNext: number;
  level: number;
  className?: string;
  classId?: TankClassId;
  statAllocations: Record<UpgradeableStat, number>;
  statPointsEarned: number;
  unspentStatPoints: number;
  pendingClassEvolution?: boolean;
  classEvolutionChoices?: TankClassId[];
};

type ClassEvolutionState = {
  level: number;
  choices: TankClassId[];
} | null;

type WaveState = {
  wave: number;
  state: "active" | "cleared" | "incoming";
  countdownMs?: number;
} | null;

type DeathRecap = {
  killerName?: string;
  survivalTime?: number;
  xpEarned?: number;
};

type GameState = {
  started: boolean;
  playerName: string;
  gameMode: GameModeId;
  playerPos: { x: number; y: number };
  isAlive: boolean;
  hud: HudState;
  deathRecap: DeathRecap | null;
  classEvolution: ClassEvolutionState;
  waveState: WaveState;
  killFeed: string[];
  settings: {
    autoFire: boolean;
    aimAssist: boolean;
    reduceMotion: boolean;
    soundEnabled: boolean;
    volume: number;
  };
  setPlayerPos: (pos: { x: number; y: number }) => void;
  setPlayerName: (name: string) => void;
  setGameMode: (mode: GameModeId) => void;
  setHud: (hud: HudState) => void;
  setDeathRecap: (recap: DeathRecap | null) => void;
  setClassEvolution: (state: ClassEvolutionState) => void;
  setWaveState: (state: WaveState) => void;
  pushKillFeed: (message: string) => void;
  toggleSetting: (key: "autoFire" | "aimAssist" | "reduceMotion" | "soundEnabled") => void;
  setVolume: (volume: number) => void;
  startGame: () => void;
  die: (recap?: DeathRecap) => void;
  respawn: () => void;
};

const defaultHud: HudState = {
  health: 120,
  maxHealth: 120,
  xp: 0,
  xpToNext: 100,
  level: 1,
  statAllocations: createEmptyAllocations(),
  statPointsEarned: 0,
  unspentStatPoints: 0,
};

export const useGameStore = create<GameState>((set) => ({
  started: false,
  playerName: "",
  gameMode: "ffa",
  playerPos: { x: 0, y: 0 },
  isAlive: true,
  hud: defaultHud,
  deathRecap: null,
  classEvolution: null,
  waveState: null,
  killFeed: [],
  settings: {
    autoFire: false,
    aimAssist: true,
    reduceMotion: false,
    soundEnabled: true,
    volume: 0.7,
  },
  setPlayerPos: (pos) => set({ playerPos: pos }),
  setPlayerName: (name) => set({ playerName: name }),
  setGameMode: (mode) => set({ gameMode: mode }),
  setHud: (hud) => set({ hud }),
  setDeathRecap: (recap) => set({ deathRecap: recap }),
  setClassEvolution: (classEvolution) => set({ classEvolution }),
  setWaveState: (waveState) => set({ waveState }),
  pushKillFeed: (message) =>
    set((s) => ({
      killFeed: [message, ...s.killFeed].slice(0, 8),
    })),
  toggleSetting: (key) =>
    set((s) => ({
      settings: { ...s.settings, [key]: !s.settings[key] },
    })),
  setVolume: (volume) =>
    set((s) => ({
      settings: { ...s.settings, volume: Math.max(0, Math.min(1, volume)) },
    })),
  startGame: () =>
    set({
      started: true,
      isAlive: true,
      deathRecap: null,
      killFeed: [],
      classEvolution: null,
      waveState: null,
      hud: defaultHud,
    }),
  die: (recap) => set({ isAlive: false, deathRecap: recap ?? null }),
  respawn: () => set({ isAlive: true, deathRecap: null }),
}));
