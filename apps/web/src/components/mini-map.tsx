import { useEffect, useRef } from "react";

interface MiniMapProps {
  worldSize: { width: number; height: number };
  playerPos: { x: number; y: number };
  viewSize?: number; // optional viewSize to scale minimap size
}

export const MiniMap = ({
  worldSize,
  playerPos,
  viewSize = 150,
}: MiniMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw player position
    const scaleX = viewSize / worldSize.width;
    const scaleY = viewSize / worldSize.height;

    const px = playerPos.x * scaleX;
    const py = playerPos.y * scaleY;

    ctx.fillStyle = "lime";
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, 2 * Math.PI);
    ctx.fill();
  }, [playerPos, worldSize]);

  return (
    <canvas
      ref={canvasRef}
      width={viewSize}
      height={viewSize}
      className="absolute right-4 bottom-4 bg-black/30 rounded-md border border-white/20"
    />
  );
};
