// packages/game-core/src/GameEvents.ts
import mitt from "mitt";
import type { UpgradeableStat } from "./data/stat-allocation";
import type { TankClassId } from "./data/tank-classes";

type Events = {
  playerPos: { x: number; y: number };
  scoreUpdate: { id: string; name: string; score: number }[];
  playerDied: { killerName?: string; survivalTime?: number; xpEarned?: number };
  playerHit: void;
  statPointGained: {
    level: number;
    statPointsEarned: number;
    unspent: number;
  };
  classEvolution: { level: number; choices: TankClassId[] };
  hudUpdate: {
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
  minimapUpdate: {
    player: { x: number; y: number };
    bots: { x: number; y: number; teamId?: string }[];
    shapes?: { x: number; y: number }[];
    viewport: { x: number; y: number; width: number; height: number };
  };
  killFeed: { message: string };
  floatingText: { text: string; x: number; y: number };
  combatFx: {
    type: "shoot" | "hit" | "death" | "evolve";
    x: number;
    y: number;
    color?: number;
    sourceId?: string;
    targetId?: string;
  };
  waveUpdate: {
    wave: number;
    state: "active" | "cleared" | "incoming";
    countdownMs?: number;
  };
};

export const gameEvents = mitt<Events>();

export type { UpgradeableStat, TankClassId };
