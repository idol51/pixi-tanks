import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";

export const RespawnScreen = () => {
  const { respawn, playerName, deathRecap, gameMode, settings } = useGameStore();
  const canRespawn = gameMode !== "survival";
  const Wrapper = settings.reduceMotion ? "div" : motion.div;
  const wrapperProps = settings.reduceMotion
    ? { className: "flex flex-col items-center gap-4 bg-black/60 p-8 rounded-2xl" }
    : {
        className: "flex flex-col items-center gap-4 bg-black/60 p-8 rounded-2xl",
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 text-white"
      style={{
        backgroundImage: `url(/bg-img.webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Wrapper {...wrapperProps}>
        <h1 className="text-3xl font-bold">You Died, {playerName}</h1>
        {deathRecap?.killerName && (
          <p className="text-lg">Destroyed by {deathRecap.killerName}</p>
        )}
        {deathRecap?.survivalTime != null && (
          <p className="text-white/80">
            Survived {deathRecap.survivalTime}s · Score {deathRecap.xpEarned ?? 0}
          </p>
        )}
        {canRespawn ? (
          <Button
            onClick={respawn}
            className="bg-green-600 hover:bg-green-700"
          >
            Respawn
          </Button>
        ) : (
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Play Again
          </Button>
        )}
      </Wrapper>
    </div>
  );
};
