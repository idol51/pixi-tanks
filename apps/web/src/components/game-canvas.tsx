import { useEffect, useRef, useState, useCallback } from "react";
import { Application, isMobile } from "pixi.js";
import {
  Entity,
  GameWorld,
  TankClassId,
  UpgradeableStat,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  gameEvents,
} from "@pixi-tanks/game-core";
import { Viewport } from "pixi-viewport";
import { Leaderboard } from "./leader-board";
import { MiniMap } from "./mini-map";
import { useGameStore } from "@/store/gameStore";
import { Joystick } from "./joystick";
import {
  applyKeyboardMouseInput,
  applyMobileInput,
  createInputListeners,
} from "@/hooks/useInputBridge";
import { loadGameAssets } from "@pixi-tanks/game-core";
import { GameHud } from "./game-hud";
import { KillFeed } from "./kill-feed";
import { ClassEvolutionBar } from "./class-evolution-bar";
import { WaveBanner } from "./wave-banner";
import { RespawnScreen } from "./respawn-screen";
import { FloatingTextLayer } from "./floating-text";

type GameSession = {
  game: GameWorld;
  viewport: Viewport;
  tank: Entity;
};

export function GameCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<GameSession | null>(null);
  const wasAliveRef = useRef(true);

  const movementJoystickRef = useRef({ x: 0, y: 0 });
  const aimJoystickRef = useRef({ x: 0, y: 0 });
  const keysRef = useRef(new Set<string>());
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, mouseDown: false });

  const {
    playerPos,
    playerName,
    gameMode,
    hud,
    isAlive,
    classEvolution,
    killFeed,
    setClassEvolution,
  } = useGameStore();

  const [minimapData, setMinimapData] = useState<{
    player: { x: number; y: number };
    bots: { x: number; y: number; teamId?: string }[];
    shapes?: { x: number; y: number }[];
    viewport?: { x: number; y: number; width: number; height: number };
  }>({ player: { x: 0, y: 0 }, bots: [] });

  useEffect(() => {
    const handler = (data: {
      player: { x: number; y: number };
      bots: { x: number; y: number; teamId?: string }[];
      shapes?: { x: number; y: number }[];
      viewport: { x: number; y: number; width: number; height: number };
    }) => {
      setMinimapData({
        player: data.player,
        bots: data.bots,
        shapes: data.shapes,
        viewport: data.viewport,
      });
    };
    gameEvents.on("minimapUpdate", handler);
    return () => gameEvents.off("minimapUpdate", handler);
  }, []);

  useEffect(() => {
    const shakeHandler = () => {
      const { settings } = useGameStore.getState();
      if (settings.reduceMotion) return;
      const s = sessionRef.current;
      if (!s) return;
      const baseX = s.viewport.center.x;
      const baseY = s.viewport.center.y;
      let frame = 0;
      const shake = () => {
        if (frame++ > 8) {
          s.viewport.moveCenter(baseX, baseY);
          return;
        }
        s.viewport.moveCenter(
          baseX + (Math.random() - 0.5) * 12,
          baseY + (Math.random() - 0.5) * 12
        );
        requestAnimationFrame(shake);
      };
      shake();
    };
    gameEvents.on("playerHit", shakeHandler);
    return () => gameEvents.off("playerHit", shakeHandler);
  }, []);

  useEffect(() => {
    const app = new Application();
    let cleanupInput: (() => void) | undefined;

    app
      .init({
        resizeTo: window,
        backgroundColor: 0x1e1e1e,
        antialias: true,
      })
      .then(async () => {
        const viewport = new Viewport({
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          worldWidth: WORLD_WIDTH,
          worldHeight: WORLD_HEIGHT,
          events: app.renderer.events,
        });

        canvasRef.current?.appendChild(app.canvas);
        app.stage.addChild(viewport);

        await loadGameAssets(app.renderer);

        const game = new GameWorld(viewport, gameMode, playerName);
        game.init();
        const tank = game.getPlayerTank();
        if (!tank) return;

        sessionRef.current = { game, viewport, tank };

        cleanupInput = createInputListeners(
          viewport,
          (keys) => {
            keysRef.current = keys;
          },
          (mouse) => {
            mouseRef.current = { ...mouseRef.current, ...mouse };
          }
        );

        app.ticker.add(({ deltaMS }) => {
          const s = sessionRef.current;
          if (!s) return;

          const { settings: liveSettings } = useGameStore.getState();

          if (isMobile.any) {
            applyMobileInput(
              s.tank,
              movementJoystickRef.current,
              aimJoystickRef.current,
              liveSettings.autoFire
            );
          } else {
            applyKeyboardMouseInput(
              s.tank,
              keysRef.current,
              mouseRef.current,
              liveSettings.autoFire
            );
          }

          s.game.update(deltaMS);
        });
      });

    return () => {
      cleanupInput?.();
      sessionRef.current?.game.destroy();
      app.destroy(true, { children: true });
      sessionRef.current = null;
    };
  }, [gameMode, playerName]);

  useEffect(() => {
    if (isAlive && !wasAliveRef.current && sessionRef.current) {
      const tank = sessionRef.current.game.respawnPlayer();
      if (tank) {
        sessionRef.current.tank = tank;
      }
    }
    wasAliveRef.current = isAlive;
  }, [isAlive]);

  const handleAdjustStat = useCallback((stat: UpgradeableStat, delta: 1 | -1) => {
    sessionRef.current?.game.adjustPlayerStat(stat, delta);
  }, []);

  const handleClassEvolution = useCallback((classId: TankClassId) => {
    sessionRef.current?.game.applyPlayerClassEvolution(classId);
    setClassEvolution(null);
  }, [setClassEvolution]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Leaderboard />
      {isAlive && <GameHud hud={hud} onAdjustStat={handleAdjustStat} />}
      {classEvolution && (
        <ClassEvolutionBar
          level={classEvolution.level}
          choices={classEvolution.choices}
          onPick={handleClassEvolution}
        />
      )}
      {gameMode === "survival" && <WaveBanner />}
      <KillFeed messages={killFeed} />
      <FloatingTextLayer playerPos={playerPos} />
      <div ref={canvasRef} className="w-full h-full" />
      <MiniMap
        playerPos={minimapData.player}
        bots={minimapData.bots}
        shapes={minimapData.shapes}
        viewport={minimapData.viewport}
      />
      {!isAlive && <RespawnScreen />}
      {isMobile.any && (
        <>
          <Joystick
            position={{ bottom: "50px", left: "50px" }}
            onMove={(dir) => {
              movementJoystickRef.current = dir;
            }}
          />
          <Joystick
            position={{ bottom: "50px", right: "50px" }}
            onMove={(dir) => {
              aimJoystickRef.current = dir;
            }}
          />
        </>
      )}
    </div>
  );
}
