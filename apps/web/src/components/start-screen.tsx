// apps/web/src/components/StartScreen.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/store/gameStore";
import { useState } from "react";

export const StartScreen = () => {
  const { startGame, setPlayerName } = useGameStore();
  const [name, setName] = useState("");

  const handleStart = () => {
    if (name.trim()) {
      setPlayerName(name.trim());
      startGame();
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <Card className="bg-white/10 border-white/20 backdrop-blur-md p-6 w-[90%] max-w-md text-white rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Enter Your Name
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            className="bg-white/10 border-white/30 placeholder:text-white"
            placeholder="Your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
          />
          <Button
            onClick={handleStart}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Start Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
