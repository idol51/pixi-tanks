import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/store/gameStore";

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
    <div
      className="fixed inset-0 flex items-center justify-center z-40"
      style={{
        backgroundImage: `url(/bg-img-2.webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="bg-white/10 border-white/20 backdrop-blur-md p-6 w-[90%] max-w-md text-white rounded-2xl">
        <CardHeader>
          <img
            src={"/logo/full-logo-nobg.png"}
            alt="Pixi Tanks Logo"
            className="mx-auto mb-2 w-64 h-30 object-cover"
            draggable={false}
          />
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

          {/* Ad Unit */}
          <div id="container-7d1f5d03fb44647518e5f3c916050137" />
        </CardContent>
      </Card>
    </div>
  );
};
