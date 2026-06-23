import {
  UpgradeableStat,
  UPGRADEABLE_STATS,
  MAX_STAT_POINTS,
} from "@pixi-tanks/game-core";
import { HudState } from "@/store/gameStore";
import { useEffect } from "react";
import { isMobile } from "pixi.js";
import { useGameStore } from "@/store/gameStore";

const STAT_LABELS: Record<UpgradeableStat, string> = {
  maxHealth: "Health",
  healthRegen: "Regen",
  speed: "Speed",
  reload: "Reload",
  bulletDamage: "Damage",
  bulletPenetration: "Penetration",
  bulletSpeed: "Bullet Spd",
};

const KEY_MAP: Record<string, UpgradeableStat> = {
  "1": "maxHealth",
  "2": "healthRegen",
  "3": "speed",
  "4": "reload",
  "5": "bulletDamage",
  "6": "bulletPenetration",
  "7": "bulletSpeed",
};

function SegmentBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-3 w-full bg-black/60 border border-[var(--game-accent-dim)] rounded-sm overflow-hidden p-px">
      <div
        className="h-full transition-all duration-200 rounded-sm"
        style={{
          width: `${Math.max(0, Math.min(100, pct))}%`,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          boxShadow: `0 0 8px ${color}66`,
        }}
      />
    </div>
  );
}

function StatPips({
  stat,
  points,
  unspent,
  onAdjust,
}: {
  stat: UpgradeableStat;
  points: number;
  unspent: number;
  onAdjust: (stat: UpgradeableStat, delta: 1 | -1) => void;
}) {
  return (
    <div className="flex gap-0.5" role="group" aria-label={STAT_LABELS[stat]}>
      {Array.from({ length: MAX_STAT_POINTS }, (_, i) => {
        const filled = i < points;
        const canAdd = !filled && i === points && unspent > 0;
        const canRemove = filled && i === points - 1;
        return (
          <button
            key={i}
            type="button"
            disabled={!canAdd && !canRemove}
            onClick={() => onAdjust(stat, canRemove ? -1 : 1)}
            className={[
              "w-3.5 h-3.5 border transition-all",
              filled
                ? "bg-[var(--game-accent)] border-[var(--game-accent)] shadow-[0_0_6px_var(--game-accent-dim)]"
                : "bg-black/40 border-[var(--game-accent-dim)]",
              canAdd || canRemove
                ? "cursor-pointer hover:scale-110 hover:border-[var(--game-accent)]"
                : "cursor-default opacity-70",
            ].join(" ")}
            aria-label={`${STAT_LABELS[stat]} pip ${i + 1}`}
          />
        );
      })}
    </div>
  );
}

export function GameHud({
  hud,
  onAdjustStat,
}: {
  hud: HudState;
  onAdjustStat: (stat: UpgradeableStat, delta: 1 | -1) => void;
}) {
  const reduceMotion = useGameStore((s) => s.settings.reduceMotion);
  const unspent = hud.unspentStatPoints ?? 0;
  const healthPct = (hud.health / hud.maxHealth) * 100;
  const xpPct = (hud.xp / hud.xpToNext) * 100;

  useEffect(() => {
    if (isMobile.any) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      const stat = KEY_MAP[e.key];
      if (!stat) return;
      e.preventDefault();
      onAdjustStat(stat, e.shiftKey ? -1 : 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onAdjustStat]);

  return (
    <div
      className={[
        "absolute top-4 left-4 z-10 w-56 text-white text-xs select-none",
        unspent > 0 && !reduceMotion ? "game-glow" : "",
      ].join(" ")}
    >
      <div className="game-panel p-3 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[var(--game-accent)] font-display font-bold text-sm tracking-wide game-text-glow">
              LVL {hud.level}
            </div>
            {hud.className && (
              <div className="text-[10px] text-[var(--game-accent)]/70 uppercase tracking-widest font-display">
                {hud.className}
              </div>
            )}
          </div>
          <div
            className={[
              "text-[10px] font-mono px-2 py-0.5 border rounded-sm",
              unspent > 0
                ? "border-[var(--game-gold)]/80 text-[var(--game-gold)] bg-[var(--game-gold)]/10"
                : "border-white/20 text-white/50",
            ].join(" ")}
          >
            PTS {unspent}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-white/60 mb-1">
            <span>HP</span>
            <span>
              {Math.ceil(hud.health)} / {hud.maxHealth}
            </span>
          </div>
          <SegmentBar pct={healthPct} color="#22cc44" />
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-white/60 mb-1">
            <span>XP</span>
            <span>
              {Math.floor(hud.xp)} / {hud.xpToNext}
            </span>
          </div>
          <SegmentBar pct={xpPct} color="var(--game-gold)" />
        </div>

        <div className="border-t border-[var(--game-accent-dim)] pt-2 space-y-1.5">
          {!isMobile.any && (
            <div className="text-[9px] text-white/40 text-center mb-1">
              1–7 spend · Shift+1–7 refund
            </div>
          )}
          {UPGRADEABLE_STATS.map((stat, i) => {
            const points = hud.statAllocations?.[stat] ?? 0;
            return (
              <div key={stat} className="flex items-center gap-1.5">
                <span className="w-14 truncate text-[10px] text-white/80">
                  {!isMobile.any && (
                    <span className="text-[var(--game-accent)]/40 mr-0.5">
                      {i + 1}
                    </span>
                  )}
                  {STAT_LABELS[stat]}
                </span>
                <StatPips
                  stat={stat}
                  points={points}
                  unspent={unspent}
                  onAdjust={onAdjustStat}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
