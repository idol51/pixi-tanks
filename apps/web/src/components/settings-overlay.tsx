import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/gameStore";
import { useState } from "react";

export function SettingsOverlay() {
  const [open, setOpen] = useState(false);
  const { settings, toggleSetting, setVolume } = useGameStore();

  if (!open) {
    return (
      <Button
        className="fixed bottom-4 left-4 z-50 opacity-70"
        variant="secondary"
        onClick={() => setOpen(true)}
      >
        Settings
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900 text-white p-6 rounded-xl w-80 space-y-4 border border-white/10">
        <h2 className="text-lg font-semibold">Settings</h2>
        <label className="flex items-center justify-between gap-4 text-sm">
          Auto-fire
          <input
            type="checkbox"
            checked={settings.autoFire}
            onChange={() => toggleSetting("autoFire")}
          />
        </label>
        <label className="flex items-center justify-between gap-4 text-sm">
          Aim assist (mobile)
          <input
            type="checkbox"
            checked={settings.aimAssist}
            onChange={() => toggleSetting("aimAssist")}
          />
        </label>
        <label className="flex items-center justify-between gap-4 text-sm">
          Reduce motion
          <input
            type="checkbox"
            checked={settings.reduceMotion}
            onChange={() => toggleSetting("reduceMotion")}
          />
        </label>
        <label className="flex items-center justify-between gap-4 text-sm">
          Sound
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={() => toggleSetting("soundEnabled")}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="flex justify-between">
            Volume
            <span className="text-white/60">{Math.round(settings.volume * 100)}%</span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(settings.volume * 100)}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            disabled={!settings.soundEnabled}
            className="w-full"
          />
        </label>
        <Button className="w-full" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>
    </div>
  );
}
