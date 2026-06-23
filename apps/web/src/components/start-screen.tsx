import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
      <Card className="bg-white/10 border-white/20 backdrop-blur-md p-6 w-[90%] max-w-md text-white rounded-2xl">
        <CardHeader>
          <img
            src={"/logo/full-logo-nobg.png"}
            alt="Pixi Tanks Logo"
            className="mx-auto mb-2 w-64 h-30 object-cover"
            draggable={false}
          />
          <CardTitle className="text-center text-2xl">Enter Your Name</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            className="bg-white/10 border-white/30 placeholder:text-white"
            placeholder="Your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
          />
          <ModeSelect
            value={gameMode}
            onChange={(mode: GameModeId) => setGameMode(mode)}
          />
          <Button
            onClick={handleStart}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Start Game
          </Button>
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            onClick={() => setShowTree(true)}
          >
            View Class Tree
          </Button>
          <div id="container-7d1f5d03fb44647518e5f3c916050137" />
        </CardContent>
      </Card>
      </motion.div>
      {showTree && <ClassTree onClose={() => setShowTree(false)} />}
    </div>
  );
};
