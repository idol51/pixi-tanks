import { useGameStore } from "@/store/gameStore";

type SfxName = "shoot" | "hit" | "levelUp" | "death" | "evolve";

let audioCtx: AudioContext | null = null;
const lastPlayed: Partial<Record<SfxName, number>> = {};
const MIN_INTERVAL_MS: Record<SfxName, number> = {
  shoot: 80,
  hit: 100,
  levelUp: 400,
  death: 250,
  evolve: 400,
};

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

export function unlockAudio() {
  const ctx = getCtx();
  if (ctx?.state === "suspended") {
    void ctx.resume();
  }
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = "square",
  gain = 0.08
) {
  const { soundEnabled, volume } = useGameStore.getState().settings;
  if (!soundEnabled || volume <= 0) return;

  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain * volume;
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

const SFX: Record<SfxName, () => void> = {
  shoot: () => tone(220, 0.05, "square", 0.04),
  hit: () => tone(120, 0.08, "sawtooth", 0.06),
  levelUp: () => {
    tone(440, 0.1, "sine", 0.07);
    setTimeout(() => tone(660, 0.15, "sine", 0.07), 80);
  },
  death: () => {
    tone(180, 0.2, "sawtooth", 0.08);
    setTimeout(() => tone(90, 0.3, "sawtooth", 0.06), 100);
  },
  evolve: () => {
    tone(330, 0.1, "sine", 0.07);
    setTimeout(() => tone(550, 0.1, "sine", 0.07), 90);
    setTimeout(() => tone(880, 0.2, "sine", 0.07), 180);
  },
};

export function playSfx(name: SfxName) {
  const { soundEnabled, reduceMotion } = useGameStore.getState().settings;
  if (!soundEnabled || reduceMotion) return;

  const now = performance.now();
  const minGap = MIN_INTERVAL_MS[name];
  const last = lastPlayed[name] ?? 0;
  if (now - last < minGap) return;
  lastPlayed[name] = now;

  try {
    SFX[name]?.();
  } catch {
    // Audio may be blocked until user gesture
  }
}
