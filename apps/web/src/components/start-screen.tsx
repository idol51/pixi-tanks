import { useState } from "react";
import {
  GameButton,
  GameInput,
  GamePanel,
  GamePanelContent,
  GamePanelHeader,
  GamePanelTitle,
} from "@/components/game-ui";
import { useGameStore } from "@/store/gameStore";
import { ModeSelect } from "./mode-select";
import { GameModeId } from "@pixi-tanks/game-core";
import { motion } from "framer-motion";
import { unlockAudio } from "@/utils/sfx";
import { ClassTree } from "./class-tree";

export const StartScreen = () => {
  const { startGame, setPlayerName, setGameMode, gameMode } = useGameStore();
  const [name, setName] = useState("");
  const [showTree, setShowTree] = useState(false);

  const handleStart = () => {
    if (name.trim()) {
      unlockAudio();
      setPlayerName(name.trim());
      startGame();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-40"
      style={{
        backgroundImage: `url(/bg-img-2.webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0a120a]/80" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-[90%] max-w-md"
      >
        <GamePanel glow className="p-1">
          <GamePanelHeader className="flex-col items-center text-center">
            <img
              src="/logo/full-logo-nobg.png"
              alt="Pixi Tanks Logo"
              className="mx-auto mb-2 w-64 h-30 object-cover"
              draggable={false}
            />
            <GamePanelTitle className="text-2xl">Enter Your Name</GamePanelTitle>
          </GamePanelHeader>
          <GamePanelContent>
            <GameInput
              placeholder="Your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
            />
            <ModeSelect
              value={gameMode}
              onChange={(mode: GameModeId) => setGameMode(mode)}
            />
            <GameButton
              onClick={handleStart}
              className="w-full"
              size="lg"
              disabled={!name.trim()}
            >
              Start Game
            </GameButton>
            <GameButton
              variant="secondary"
              className="w-full"
              onClick={() => setShowTree(true)}
            >
              View Class Tree
            </GameButton>
            <div id="container-7d1f5d03fb44647518e5f3c916050137" />
          </GamePanelContent>
        </GamePanel>
      </motion.div>
      {showTree && <ClassTree onClose={() => setShowTree(false)} />}
    </div>
  );
};
