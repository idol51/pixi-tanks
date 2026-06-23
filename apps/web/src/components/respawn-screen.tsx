import {
  GameButton,
  GamePanel,
  GamePanelContent,
} from "@/components/game-ui";
import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";

export const RespawnScreen = () => {
  const { respawn, exitToMenu, playerName, deathRecap, gameMode, settings } =
    useGameStore();
  const canRespawn = gameMode !== "survival";
  const Wrapper = settings.reduceMotion ? "div" : motion.div;
  const wrapperProps = settings.reduceMotion
    ? { className: "relative z-10" }
    : {
        className: "relative z-10",
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-40"
      style={{
        backgroundImage: `url(/bg-img.webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--game-danger)]/20 via-black/60 to-black/40" />

      <Wrapper {...wrapperProps}>
        <GamePanel glow className="text-center min-w-[280px] max-w-md">
          <GamePanelContent className="items-center gap-4 py-6">
            <h1 className="text-3xl font-display font-bold text-[var(--game-danger)] game-text-glow tracking-wide">
              You Died, {playerName}
            </h1>
            {deathRecap?.killerName && (
              <p className="text-lg font-display text-white/90">
                Destroyed by {deathRecap.killerName}
              </p>
            )}
            {deathRecap?.survivalTime != null && (
              <p className="text-white/70 font-display text-sm">
                Survived {deathRecap.survivalTime}s · Score{" "}
                {deathRecap.xpEarned ?? 0}
              </p>
            )}
            {canRespawn ? (
              <GameButton onClick={respawn} className="w-full min-w-[200px]">
                Respawn
              </GameButton>
            ) : (
              <GameButton
                variant="secondary"
                onClick={() => window.location.reload()}
                className="w-full min-w-[200px]"
              >
                Play Again
              </GameButton>
            )}
            <GameButton
              variant="secondary"
              onClick={exitToMenu}
              className="w-full min-w-[200px]"
            >
              Main Menu
            </GameButton>
          </GamePanelContent>
        </GamePanel>
      </Wrapper>
    </div>
  );
};
