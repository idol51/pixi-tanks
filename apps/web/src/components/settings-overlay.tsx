import {
  GameButton,
  GamePanel,
  GamePanelContent,
  GamePanelHeader,
  GamePanelTitle,
} from "@/components/game-ui";
import { useGameStore } from "@/store/gameStore";
import { useState } from "react";
import { Settings } from "lucide-react";

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 text-sm font-display tracking-wide cursor-pointer group">
      <span className="text-white/85 group-hover:text-white transition-colors">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={[
          "relative w-11 h-6 rounded-full border transition-colors shrink-0",
          checked
            ? "bg-[var(--game-accent)]/30 border-[var(--game-accent)]"
            : "bg-black/40 border-white/20",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform",
            checked
              ? "translate-x-5 bg-[var(--game-accent)]"
              : "translate-x-0 bg-white/50",
          ].join(" ")}
        />
      </button>
    </label>
  );
}

export function SettingsOverlay() {
  const [open, setOpen] = useState(false);
  const { settings, toggleSetting, setVolume } = useGameStore();

  if (!open) {
    return (
      <GameButton
        variant="secondary"
        size="icon"
        className="fixed bottom-4 left-4 z-50 opacity-90"
        onClick={() => setOpen(true)}
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </GameButton>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <GamePanel glow className="w-full max-w-sm">
        <GamePanelHeader>
          <GamePanelTitle>Settings</GamePanelTitle>
        </GamePanelHeader>
        <GamePanelContent className="space-y-4">
          <ToggleRow
            label="Auto-fire"
            checked={settings.autoFire}
            onChange={() => toggleSetting("autoFire")}
          />
          <ToggleRow
            label="Aim assist (mobile)"
            checked={settings.aimAssist}
            onChange={() => toggleSetting("aimAssist")}
          />
          <ToggleRow
            label="Reduce motion"
            checked={settings.reduceMotion}
            onChange={() => toggleSetting("reduceMotion")}
          />
          <ToggleRow
            label="Sound"
            checked={settings.soundEnabled}
            onChange={() => toggleSetting("soundEnabled")}
          />
          <label className="flex flex-col gap-2 text-sm font-display">
            <span className="flex justify-between text-white/85">
              Volume
              <span className="text-[var(--game-accent)]/70 font-mono">
                {Math.round(settings.volume * 100)}%
              </span>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(settings.volume * 100)}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
              disabled={!settings.soundEnabled}
              className="w-full accent-[var(--game-accent)]"
            />
          </label>
          <GameButton className="w-full" onClick={() => setOpen(false)}>
            Close
          </GameButton>
        </GamePanelContent>
      </GamePanel>
    </div>
  );
}
