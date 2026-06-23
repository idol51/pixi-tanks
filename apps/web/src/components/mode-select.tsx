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
      {GAME_MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onChange(mode.id)}
          className={`text-left p-3 rounded-lg border transition-colors ${
            value === mode.id
              ? "border-blue-400 bg-blue-500/20 text-white"
              : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
          }`}
        >
          <div className="font-semibold text-sm">{mode.label}</div>
          <div className="text-xs opacity-80">{mode.description}</div>
        </button>
      ))}
    </div>
  );
}
