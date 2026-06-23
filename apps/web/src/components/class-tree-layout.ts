import { TankClassId } from "@pixi-tanks/game-core";

export const CLASS_TREE_VIEW_SIZE = 500;
export const CLASS_TREE_CENTER = CLASS_TREE_VIEW_SIZE / 2;

export const CLASS_TREE_RADII = {
  tier1: 90,
  tier2: 155,
  tier3: 220,
} as const;

export type ClassTreeSpoke = {
  angleDeg: number;
  path: [TankClassId, TankClassId, TankClassId];
};

export const CLASS_TREE_SPOKES: ClassTreeSpoke[] = [
  { angleDeg: -90, path: ["twin", "triple", "quad"] },
  { angleDeg: -18, path: ["sniper", "assassin", "ranger"] },
  { angleDeg: 54, path: ["machineGun", "gunner", "sprayer"] },
  { angleDeg: 126, path: ["flankGuard", "triAngle", "booster"] },
  { angleDeg: 198, path: ["brawler", "destroyer", "annihilator"] },
];

export type ClassTreeNode = {
  id: TankClassId;
  x: number;
  y: number;
  tier: 0 | 1 | 2 | 3;
  parentId: TankClassId | null;
  facingAngleDeg: number;
};

export type ClassTreeEdge = {
  from: TankClassId;
  to: TankClassId;
};

function polarToXY(angleDeg: number, radius: number, cx: number, cy: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

export function computeClassTreeNodes(
  viewSize = CLASS_TREE_VIEW_SIZE
): ClassTreeNode[] {
  const cx = viewSize / 2;
  const cy = viewSize / 2;
  const scale = viewSize / CLASS_TREE_VIEW_SIZE;

  const nodes: ClassTreeNode[] = [
    {
      id: "basic",
      x: cx,
      y: cy,
      tier: 0,
      parentId: null,
      facingAngleDeg: -90,
    },
  ];

  const radii = [
    0,
    CLASS_TREE_RADII.tier1 * scale,
    CLASS_TREE_RADII.tier2 * scale,
    CLASS_TREE_RADII.tier3 * scale,
  ];

  for (const spoke of CLASS_TREE_SPOKES) {
    let parentId: TankClassId = "basic";
    spoke.path.forEach((classId, index) => {
      const tier = (index + 1) as 1 | 2 | 3;
      const { x, y } = polarToXY(spoke.angleDeg, radii[tier], cx, cy);
      nodes.push({
        id: classId,
        x,
        y,
        tier,
        parentId,
        facingAngleDeg: spoke.angleDeg,
      });
      parentId = classId;
    });
  }

  return nodes;
}

export function computeClassTreeEdges(nodes: ClassTreeNode[]): ClassTreeEdge[] {
  return nodes
    .filter((n) => n.parentId != null)
    .map((n) => ({ from: n.parentId!, to: n.id }));
}

export function getNodeById(
  nodes: ClassTreeNode[],
  id: TankClassId
): ClassTreeNode | undefined {
  return nodes.find((n) => n.id === id);
}
