import { useGameStore } from "@/store/gameStore";
import { useGameEvents } from "@/hooks/useGameEvents";
import { StartScreen } from "@/components/start-screen";
import { GameCanvas } from "@/components/game-canvas";
import { OrientationOverlay } from "@/components/orientation-overlay";
import FullscreenOverlay from "./components/fullscreen-overlay";
import { SettingsOverlay } from "./components/settings-overlay";

export default function App() {
  const started = useGameStore((s) => s.started);
  useGameEvents();

  return (
    <>
      <OrientationOverlay />
      <FullscreenOverlay />
      <SettingsOverlay />
      {!started && <StartScreen />}
      {started && <GameCanvas />}
    </>
  );
}
