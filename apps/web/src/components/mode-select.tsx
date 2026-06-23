import { GameModeId } from "@pixi-tanks/game-core";

export const GAME_MODES: {
  id: GameModeId;
  label: string;
  description: string;
}[] = [
  {
    id: "ffa",
    label: "FFA with Bots",
    description: "Free-for-all. Respawn and climb the leaderboard.",
  },
  {
    id: "survival",
    label: "Survival Waves",
    description: "Survive escalating waves. No respawn.",
  },
  {
    id: "team",
    label: "Team vs Bots",
    description: "Fight with ally bots against enemies.",
  },
];

export function ModeSelect({
  value,
  onChange,
}: {
  value: GameModeId;
  onChange: (mode: GameModeId) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {GAME_MODES.map((mode) => {
        const selected = value === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onChange(mode.id)}
            className={[
              "text-left p-3 rounded-md border transition-all font-display",
              selected
                ? "border-[var(--game-accent)] bg-[#00ff00]/10 text-white game-glow"
                : "border-white/15 bg-black/30 text-white/75 hover:bg-[#00ff00]/5 hover:border-[#00ff00]/30",
            ].join(" ")}
          >
            <div className="font-semibold text-sm tracking-wide">{mode.label}</div>
            <div className="text-xs opacity-75 mt-0.5">{mode.description}</div>
          </button>
        );
      })}
    </div>
  );
}
