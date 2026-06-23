import { TankClassId, getClassDef, getTankPreviewUrl } from "@pixi-tanks/game-core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";

function BarrelPreview({ classId }: { classId: TankClassId }) {
  const previewUrl = getTankPreviewUrl(classId);
  if (previewUrl) {
    return (
      <img
        src={previewUrl}
        alt=""
        className="w-12 h-12 shrink-0 object-contain"
        draggable={false}
      />
    );
  }

  const def = getClassDef(classId);
  const color = `#${def.bodyStyle.color.toString(16).padStart(6, "0")}`;

  return (
    <svg viewBox="-30 -30 60 60" className="w-12 h-12 shrink-0">
      <circle cx="0" cy="0" r={def.bodyStyle.radius * 0.6} fill={color} />
      {def.barrelLayout.map((b, i) => {
        const angle = b.angleOffset ?? 0;
        const x1 = b.offset[0] * 0.6 * Math.cos(angle) - b.offset[1] * 0.6 * Math.sin(angle);
        const y1 = b.offset[0] * 0.6 * Math.sin(angle) + b.offset[1] * 0.6 * Math.cos(angle);
        const x2 = x1 + 14 * Math.cos(angle);
        const y2 = y1 + 14 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#ccc"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

export function ClassPicker({
  level,
  choices,
  onPick,
}: {
  level: number;
  choices: TankClassId[];
  onPick: (choice: TankClassId) => void;
}) {
  const reduceMotion = useGameStore((s) => s.settings.reduceMotion);
  const Wrapper = reduceMotion ? "div" : motion.div;
  const wrapperProps = reduceMotion
    ? { className: "absolute inset-0 z-50 flex items-center justify-center p-4" }
    : {
        className: "absolute inset-0 z-50 flex items-center justify-center p-4",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };

  return (
    <Wrapper {...wrapperProps}>
      <Card className="w-full max-w-lg bg-black/90 text-white border-white/20 max-h-[85vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-center">
            Level {level} — Choose Your Evolution
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {choices.map((choice) => {
            const def = getClassDef(choice);
            return (
              <Button
                key={choice}
                variant="secondary"
                className="w-full h-auto py-3 justify-start gap-3 text-left"
                onClick={() => onPick(choice)}
              >
                <BarrelPreview classId={choice} />
                <div>
                  <div className="font-semibold">{def.name}</div>
                  <div className="text-xs text-white/70 font-normal">
                    {def.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </Wrapper>
  );
}
