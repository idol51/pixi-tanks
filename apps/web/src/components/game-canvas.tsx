import { useEffect, useRef } from "react";
import { Application, isMobile } from "pixi.js";
import { GameWorld } from "@pixi-tanks/game-core";
import { Button } from "@/components/ui/button";
import { Viewport } from "pixi-viewport";
import { useGameEvents } from "../hooks/useGameEvents";
import { Leaderboard } from "./leader-board";
import { MiniMap } from "./mini-map";
import { useGameStore } from "@/store/gameStore";
import { Joystick } from "./joystick";
import { useMouseKeyboardInput } from "@/hooks/useMouseKeyboardInput";
import { Entity } from "@pixi-tanks/game-core";
import { useJoystickInput } from "@/hooks/useJoystickInput";

export function GameCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application>(null);
  const gameRef = useRef<GameWorld>(null);
  const viewportRef = useRef<Viewport>(null);
  const tankRef = useRef<Entity>(null);

  const movementJoystickRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const aimJoystickRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useMouseKeyboardInput(tankRef.current, viewportRef.current);
  useJoystickInput(
    tankRef.current,
    viewportRef.current,
    movementJoystickRef.current,
    aimJoystickRef.current
  );

  const { playerPos } = useGameStore();

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
        viewportRef.current = viewport;
        canvasRef.current?.appendChild(app.canvas);

        app.stage.addChild(viewport);

        const game = new GameWorld(viewport, 5000, 5000);
        game.init();
        tankRef.current = game.getPlayerTank() ?? null;
        gameRef.current = game;

        // ✅ Main game loop
        app.ticker.add(({ deltaMS }) => {
          game.update(deltaMS);
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
      <MiniMap
        worldSize={{ width: 5000, height: 5000 }}
        playerPos={playerPos}
      />
      {isMobile.any && (
        <>
          <Joystick
            position={{
              bottom: "50px",
              left: "50px",
            }}
            onMove={(dir) => (movementJoystickRef.current = dir)}
          />
          <Joystick
            position={{
              bottom: "50px",
              right: "50px",
            }}
            onMove={(dir) => (aimJoystickRef.current = dir)}
          />
        </>
      )}
    </div>
  );
}
