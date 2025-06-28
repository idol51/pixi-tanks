import { useEffect, useRef } from "react";
import { Application } from "pixi.js";
import { GameWorld } from "@pixi-tanks/game-core";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import { Button } from "@/components/ui/button";
import { Viewport } from "pixi-viewport";
import { useGameEvents } from "../hooks/useGameEvents";
import { Leaderboard } from "./leader-board";
import { useMouseControls } from "@/hooks/useMouseControls";

export function GameCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const gameRef = useRef<GameWorld | null>(null);
  const keys = useKeyboardControls();
  const mouse = useMouseControls();

  useGameEvents();

  // Handle Game Init
  useEffect(() => {
    const app = new Application();
    appRef.current = app;

    app
      .init({
        resizeTo: window,
        backgroundColor: 0x1e1e1e,
        antialias: true,
      })
      .then(() => {
        const viewport = new Viewport({
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          worldWidth: 2000,
          worldHeight: 2000,
          events: app.renderer.events,
        });
        canvasRef.current?.appendChild(app.canvas);

        app.stage.addChild(viewport);

        const game = new GameWorld(viewport);
        game.init();
        gameRef.current = game;

        // ✅ Main game loop
        app.ticker.add(({ deltaMS }) => {
          game.update(deltaMS, keys, mouse);
        });
      });

    return () => {
      app.destroy(true, { children: true });
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Leaderboard />
      <div ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 space-y-2 z-10">
        <Button variant="default">Respawn</Button>
        <div className="text-white">Health: 100</div>
      </div>
    </div>
  );
}
