import {
  TankClassId,
  getClassDef,
  resolveBarrelVisual,
  barrelColorToHex,
} from "@pixi-tanks/game-core";
import { cn } from "@/lib/utils";

const SIZE_PX = { sm: 32, md: 48, lg: 56 } as const;

const PREVIEW_SCALE = { sm: 0.55, md: 0.58, lg: 0.65 } as const;

export function TankClassPreview({
  classId,
  size = "sm",
  highlight = false,
  rotationDeg = 0,
  className,
}: {
  classId: TankClassId;
  size?: keyof typeof SIZE_PX;
  highlight?: boolean;
  rotationDeg?: number;
  className?: string;
}) {
  const px = SIZE_PX[size];
  const def = getClassDef(classId);
  const color = `#${def.bodyStyle.color.toString(16).padStart(6, "0")}`;
  const scale = PREVIEW_SCALE[size];
  const bodyR = def.bodyStyle.radius * scale;

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full flex items-center justify-center",
        highlight && "ring-2 ring-[var(--game-gold)] game-glow",
        className
      )}
      style={{ width: px, height: px }}
    >
      <svg viewBox="-30 -30 60 60" className="w-full h-full" aria-hidden>
        <g transform={`rotate(${rotationDeg})`}>
          <circle
            cx="0"
            cy="0"
            r={bodyR}
            fill={color}
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.35"
          />
          <circle
            cx="0"
            cy="0"
            r={bodyR * 0.75}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            strokeOpacity="0.2"
          />
          <circle
            cx={bodyR * 0.35}
            cy={-bodyR * 0.2}
            r={bodyR * 0.12}
            fill="#ffffff"
            fillOpacity="0.35"
          />
          {def.barrelLayout.map((b, i) => {
            const spec = resolveBarrelVisual(classId, i, b);
            const mountX = b.offset[0] * scale;
            const mountY = b.offset[1] * scale;
            const angleDeg = ((b.angleOffset ?? 0) * 180) / Math.PI;
            const barrelLen = spec.length * scale;
            const barrelW = spec.width * scale;
            const corner = Math.min(barrelW / 2, 2);
            const fill = barrelColorToHex(spec.fillColor);
            const stroke = barrelColorToHex(spec.strokeColor);

            return (
              <g
                key={i}
                transform={`translate(${mountX}, ${mountY}) rotate(${angleDeg})`}
              >
                <rect
                  x="0"
                  y={-barrelW / 2}
                  width={barrelLen}
                  height={barrelW}
                  rx={corner}
                  ry={corner}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="0.75"
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
