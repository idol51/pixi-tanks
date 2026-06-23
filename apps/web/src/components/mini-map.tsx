import { useEffect, useRef } from "react";
import { WORLD_HEIGHT, WORLD_WIDTH } from "@pixi-tanks/game-core";

interface MiniMapProps {
  playerPos: { x: number; y: number };
  bots?: { x: number; y: number; teamId?: string }[];
  shapes?: { x: number; y: number }[];
  viewport?: { x: number; y: number; width: number; height: number };
  viewSize?: number;
}

const TEAM_COLORS: Record<string, string> = {
  enemy: "#ff4444",
  ally: "#4488ff",
  ffa: "#ff8844",
};

export const MiniMap = ({
  playerPos,
  bots = [],
  shapes = [],
  viewport,
  viewSize = 150,
}: MiniMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    const scaleX = viewSize / WORLD_WIDTH;
    const scaleY = viewSize / WORLD_HEIGHT;

    for (const shape of shapes) {
      ctx.fillStyle = "#888888";
      ctx.beginPath();
      ctx.arc(shape.x * scaleX, shape.y * scaleY, 1.5, 0, 2 * Math.PI);
      ctx.fill();
    }

    for (const bot of bots) {
      ctx.fillStyle = TEAM_COLORS[bot.teamId ?? "ffa"] ?? "#ff8844";
      ctx.beginPath();
      ctx.arc(bot.x * scaleX, bot.y * scaleY, 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    if (viewport) {
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1;
      ctx.strokeRect(
        viewport.x * scaleX,
        viewport.y * scaleY,
        viewport.width * scaleX,
        viewport.height * scaleY
      );
    }

    ctx.fillStyle = "lime";
    ctx.beginPath();
    ctx.arc(playerPos.x * scaleX, playerPos.y * scaleY, 4, 0, 2 * Math.PI);
    ctx.fill();
  }, [playerPos, bots, shapes, viewport, viewSize]);

  return (
    <canvas
      ref={canvasRef}
      width={viewSize}
      height={viewSize}
      className="absolute right-4 bottom-4 bg-black/30 rounded-md border border-white/20"
    />
  );
};
