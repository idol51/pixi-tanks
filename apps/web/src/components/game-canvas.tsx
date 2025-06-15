import { useEffect, useRef } from "react";
import { Application } from "pixi.js";
import { GameWorld } from "@pixi-tanks/game-core";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import { useMouseAngle } from "../hooks/useMouseAngle";
import { Button } from "@/components/ui/button";
import { Viewport } from "pixi-viewport";
import { useGameEvents } from "../hooks/useGameEvents";
import { Leaderboard } from "./leader-board";
import { useGameStore } from "@/store/gameStore";

export function GameCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const tankIdRef = useRef<string>("player-1");
  const gameRef = useRef<GameWorld | null>(null);
  const keysRef = useKeyboardControls();
  const angle = useMouseAngle(canvasRef);

  const { playerName } = useGameStore();

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

        const game = new GameWorld(app, viewport, "player");
        gameRef.current = game;

        // ✅ Spawn player tank ONCE
        game.spawnTank("player", playerName);
        tankIdRef.current = "player";

        // ✅ Main game loop
        app.ticker.add(() => {
          const delta = app.ticker.deltaTime;
          const tank = game.tanks.get(tankIdRef.current);
          if (tank) {
            const keys = keysRef.current;
            const speed = 2;
            let dx = 0,
              dy = 0;
            if (keys.has("w") || keys.has("arrowup")) dy -= speed;
            if (keys.has("s") || keys.has("arrowdown")) dy += speed;
            if (keys.has("a") || keys.has("arrowleft")) dx -= speed;
            if (keys.has("d") || keys.has("arrowright")) dx += speed;

            tank.move({ x: dx, y: dy });
            if (angle) tank.rotate(angle); // angle is fine as a state, not used in logic branches
          }

          game.update(delta);
        });
      });

    return () => {
      app.destroy(true, { children: true });
    };
  }, []);

  useEffect(() => {
    const handleClick = () => {
      gameRef.current?.fireBullet(tankIdRef.current);
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const tank = gameRef.current?.tanks.get(tankIdRef.current);
    if (!tank || !angle) return;

    tank.aimTurret(angle);
  }, [angle]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Leaderboard />
      <div ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 space-y-2 z-10">
        <Button variant="default">Respawn</Button>
        <div className="text-white">Health: 100</div>
        <div className="text-white">
          Score: {gameRef.current?.getPlayerScore()}
        </div>
      </div>
    </div>
  );
}
