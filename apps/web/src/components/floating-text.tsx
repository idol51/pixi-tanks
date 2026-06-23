import { useEffect, useState } from "react";
import { gameEvents } from "@pixi-tanks/game-core";

type FloatingText = { id: number; text: string; x: number; y: number };

export function FloatingTextLayer({
  playerPos,
}: {
  playerPos: { x: number; y: number };
}) {
  const [texts, setTexts] = useState<FloatingText[]>([]);

  useEffect(() => {
    let id = 0;
    const handler = (data: { text: string; x: number; y: number }) => {
      const nextId = ++id;
      setTexts((prev) => [...prev, { id: nextId, ...data }]);
      setTimeout(() => {
        setTexts((prev) => prev.filter((t) => t.id !== nextId));
      }, 1200);
    };
    gameEvents.on("floatingText", handler);
    return () => gameEvents.off("floatingText", handler);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {texts.map((t) => {
        const screenX =
          ((t.x - playerPos.x) / 40) * 10 + window.innerWidth / 2;
        const screenY =
          ((t.y - playerPos.y) / 40) * 10 + window.innerHeight / 2;
        return (
          <div
            key={t.id}
            className="absolute text-yellow-300 font-bold text-sm animate-pulse"
            style={{
              left: screenX,
              top: screenY,
              transform: "translate(-50%, -50%)",
            }}
          >
            {t.text}
          </div>
        );
      })}
    </div>
  );
}
