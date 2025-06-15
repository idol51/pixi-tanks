import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/store/gameStore";

export const StartScreen = () => {
  const { startGame, setPlayerName } = useGameStore();
  const [name, setName] = useState("");
  const adRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    if (name.trim()) {
      setPlayerName(name.trim());
      startGame();
    }
  };

  useEffect(() => {
    if (adRef.current) {
      try {
        // Push ad when component mounts
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn("AdSense ad failed to load", e);
      }
    }
  }, []);

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

          {/* Google AdSense Unit */}
          <div ref={adRef}>
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-4300023215835808"
              data-ad-format="auto"
              data-ad-slot="4390593532"
              //   TODO: remove adtest in production
              // This is for testing purposes only, remove in production
              data-adtest="on"
              data-full-width-responsive="true"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
