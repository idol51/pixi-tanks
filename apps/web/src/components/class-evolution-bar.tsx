import {
  TankClassId,
  getClassDef,
  getTankPreviewUrl,
} from "@pixi-tanks/game-core";
import { useGameStore } from "@/store/gameStore";

function TankChipPreview({ classId }: { classId: TankClassId }) {
  const previewUrl = getTankPreviewUrl(classId);
  if (previewUrl) {
    return (
      <img
        src={previewUrl}
        alt=""
        className="w-8 h-8 object-contain shrink-0"
        draggable={false}
      />
    );
  }

  const def = getClassDef(classId);
  const color = `#${def.bodyStyle.color.toString(16).padStart(6, "0")}`;

  return (
    <svg viewBox="-30 -30 60 60" className="w-8 h-8 shrink-0">
      <circle cx="0" cy="0" r={def.bodyStyle.radius * 0.55} fill={color} />
      {def.barrelLayout.map((b, i) => {
        const angle = b.angleOffset ?? 0;
        const x1 =
          b.offset[0] * 0.55 * Math.cos(angle) -
          b.offset[1] * 0.55 * Math.sin(angle);
        const y1 =
          b.offset[0] * 0.55 * Math.sin(angle) +
          b.offset[1] * 0.55 * Math.cos(angle);
        const x2 = x1 + 12 * Math.cos(angle);
        const y2 = y1 + 12 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#ccc"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

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
        "bg-[#0a120a]/92 border border-yellow-400/50 rounded-lg backdrop-blur-sm",
        !reduceMotion ? "animate-pulse shadow-[0_0_20px_rgba(255,204,0,0.25)]" : "",
      ].join(" ")}
    >
      <span className="text-yellow-300 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
        Lv {level} Evolution
      </span>
      {choices.map((choice) => {
        const def = getClassDef(choice);
        return (
          <button
            key={choice}
            type="button"
            onClick={() => onPick(choice)}
            className="flex items-center gap-2 px-2 py-1.5 rounded border border-[#00ff00]/30 bg-black/40 hover:bg-[#00ff00]/10 hover:border-[#00ff00]/60 transition-colors"
          >
            <TankChipPreview classId={choice} />
            <span className="text-left">
              <span className="block text-xs font-semibold text-white">
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
