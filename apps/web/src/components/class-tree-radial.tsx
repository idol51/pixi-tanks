import { useCallback, useMemo, useState } from "react";
import { TankClassId, getClassDef } from "@pixi-tanks/game-core";
import { useGameStore } from "@/store/gameStore";
import { TankClassPreview } from "./tank-class-preview";
import {
  CLASS_TREE_CENTER,
  CLASS_TREE_RADII,
  CLASS_TREE_VIEW_SIZE,
  computeClassTreeEdges,
  computeClassTreeNodes,
  getNodeById,
} from "./class-tree-layout";

const RING_LABELS: { radius: number; label: string }[] = [
  { radius: CLASS_TREE_RADII.tier1, label: "Lv 15" },
  { radius: CLASS_TREE_RADII.tier2, label: "Lv 30" },
  { radius: CLASS_TREE_RADII.tier3, label: "Lv 45" },
];

function nodeSize(tier: 0 | 1 | 2 | 3): "sm" | "md" | "lg" {
  if (tier === 0 || tier === 1) return "lg";
  return "md";
}

function nodeHitRadius(tier: 0 | 1 | 2 | 3): number {
  if (tier === 0 || tier === 1) return 32;
  return 28;
}

export function ClassTreeRadial() {
  const currentClassId = useGameStore((s) => s.hud.classId);
  const reduceMotion = useGameStore((s) => s.settings.reduceMotion);
  const [activeId, setActiveId] = useState<TankClassId | null>(null);

  const nodes = useMemo(() => computeClassTreeNodes(), []);
  const edges = useMemo(() => computeClassTreeEdges(nodes), [nodes]);

  const activeDef = activeId ? getClassDef(activeId) : null;
  const activeNode = activeId ? getNodeById(nodes, activeId) : null;

  const isOnHighlightPath = useCallback(
    (edge: { from: TankClassId; to: TankClassId }) => {
      if (!currentClassId || currentClassId === "basic") {
        return edge.from === "basic";
      }
      let id: TankClassId | null = currentClassId;
      while (id) {
        if (edge.to === id) return true;
        const node = getNodeById(nodes, id);
        id = node?.parentId ?? null;
      }
      return false;
    },
    [currentClassId, nodes]
  );

  const dismissTooltip = () => setActiveId(null);

  return (
    <div
      className="relative w-full max-h-[min(80vh,640px)] aspect-square mx-auto"
      onClick={dismissTooltip}
    >
      <svg
        viewBox={`0 0 ${CLASS_TREE_VIEW_SIZE} ${CLASS_TREE_VIEW_SIZE}`}
        className="w-full h-full"
        role="img"
        aria-label="Tank class evolution tree"
      >
        {RING_LABELS.map(({ radius, label }) => (
          <g key={label}>
            <circle
              cx={CLASS_TREE_CENTER}
              cy={CLASS_TREE_CENTER}
              r={radius}
              fill="none"
              stroke="var(--game-accent-dim)"
              strokeWidth="1"
              strokeDasharray="4 6"
              opacity="0.45"
            />
            <text
              x={CLASS_TREE_CENTER}
              y={CLASS_TREE_CENTER - radius - 6}
              textAnchor="middle"
              fill="var(--game-gold)"
              fontSize="11"
              fontFamily="Rajdhani, system-ui, sans-serif"
              fontWeight="600"
              opacity="0.75"
            >
              {label}
            </text>
          </g>
        ))}

        {edges.map((edge) => {
          const from = getNodeById(nodes, edge.from);
          const to = getNodeById(nodes, edge.to);
          if (!from || !to) return null;
          const highlighted = isOnHighlightPath(edge);
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={
                highlighted ? "var(--game-gold)" : "var(--game-accent-dim)"
              }
              strokeWidth={highlighted ? 2.5 : 1.5}
              strokeOpacity={highlighted ? 0.85 : 0.55}
            />
          );
        })}

        {nodes.map((node) => {
          const isCurrent = node.id === currentClassId;
          const isActive = node.id === activeId;
          const r = nodeHitRadius(node.tier);
          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setActiveId((prev) => (prev === node.id ? null : node.id));
              }}
              onMouseEnter={() => setActiveId(node.id)}
              onMouseLeave={() =>
                setActiveId((prev) => (prev === node.id ? null : prev))
              }
            >
              <circle
                r={r}
                fill="transparent"
                pointerEvents="all"
              />
              {isActive && !reduceMotion && (
                <circle
                  r={r + 4}
                  fill="none"
                  stroke="var(--game-accent)"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
              )}
              <foreignObject
                x={-r}
                y={-r}
                width={r * 2}
                height={r * 2}
                pointerEvents="none"
              >
                <div className="w-full h-full flex items-center justify-center pointer-events-none">
                  <TankClassPreview
                    classId={node.id}
                    size={nodeSize(node.tier)}
                    highlight={isCurrent}
                    rotationDeg={node.facingAngleDeg}
                  />
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      {activeDef && activeNode && (
        <div
          className="absolute z-10 max-w-[220px] game-panel px-3 py-2 pointer-events-none"
          style={{
            left: `${(activeNode.x / CLASS_TREE_VIEW_SIZE) * 100}%`,
            top: `${(activeNode.y / CLASS_TREE_VIEW_SIZE) * 100}%`,
            transform: "translate(-50%, calc(-100% - 12px))",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="font-display font-bold text-[var(--game-accent)] text-sm tracking-wide">
            {activeDef.name}
          </div>
          <div className="text-[10px] text-[var(--game-gold)]/80 uppercase tracking-wider mt-0.5">
            {activeDef.evolveAt ? `Unlocks at Lv ${activeDef.evolveAt}` : "Starter class"}
          </div>
          <p className="text-xs text-white/70 mt-1 leading-snug">
            {activeDef.description}
          </p>
        </div>
      )}
    </div>
  );
}
