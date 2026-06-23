import { TankClassId, getClassDef } from "@pixi-tanks/game-core";
import { useGameStore } from "@/store/gameStore";
import { TankClassPreview } from "./tank-class-preview";

export function ClassEvolutionBar({
  level,
  choices,
  onPick,
}: {
  level: number;
  choices: TankClassId[];
  onPick: (choice: TankClassId) => void;
}) {
  const reduceMotion = useGameStore((s) => s.settings.reduceMotion);

  if (choices.length === 0) return null;

  return (
    <div
      className={[
        "absolute top-14 left-1/2 -translate-x-1/2 z-30 flex flex-wrap items-center justify-center gap-2 max-w-[96vw] px-3 py-2",
        "game-panel border-[var(--game-gold)]/50",
        !reduceMotion ? "animate-pulse game-glow" : "",
      ].join(" ")}
    >
      <span className="text-[var(--game-gold)] text-xs font-display font-bold uppercase tracking-wider whitespace-nowrap game-text-glow">
        Lv {level} Evolution
      </span>
      {choices.map((choice) => {
        const def = getClassDef(choice);
        return (
          <button
            key={choice}
            type="button"
            onClick={() => onPick(choice)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md border border-[var(--game-accent-dim)] bg-black/40 hover:bg-[var(--game-accent)]/10 hover:border-[var(--game-accent)]/60 transition-colors"
          >
            <TankClassPreview classId={choice} size="sm" />
            <span className="text-left">
              <span className="block text-xs font-display font-semibold text-white tracking-wide">
                {def.name}
              </span>
              <span className="block text-[9px] text-white/50 max-w-[120px] truncate">
                {def.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
