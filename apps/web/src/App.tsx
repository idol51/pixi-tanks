import { useGameStore } from "@/store/gameStore";
import { useGameEvents } from "@/hooks/useGameEvents";
import { StartScreen } from "@/components/start-screen";
import { RespawnScreen } from "@/components/respawn-screen";
import { GameCanvas } from "@/components/game-canvas";

export default function App() {
  const started = useGameStore((s) => s.started);
  const isAlive = useGameStore((s) => s.isAlive);
  useGameEvents();

  return (
    <>
      {!started && <StartScreen />}
      {started && !isAlive && <RespawnScreen />}
      {started && isAlive && <GameCanvas />}
    </>
  );
}
