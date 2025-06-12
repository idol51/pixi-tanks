import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/gameStore";

export const RespawnScreen = () => {
  const { respawn, playerName } = useGameStore();

  const handleRespawn = () => {
    respawn();
    // you’ll trigger GameWorld.spawnTank() from GameCanvas when `isAlive` becomes true again
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 text-white">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">You Died, {playerName} 💀</h1>
        <Button
          onClick={handleRespawn}
          className="bg-green-600 hover:bg-green-700"
        >
          Respawn
        </Button>
      </div>
    </div>
  );
};
