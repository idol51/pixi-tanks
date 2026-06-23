export const WORLD_WIDTH = 5000;
export const WORLD_HEIGHT = 5000;
export const SPAWN_MARGIN = 200;

export const NEST_CENTER = {
  x: WORLD_WIDTH / 2,
  y: WORLD_HEIGHT / 2,
};

export type SpawnZone = "centerNest" | "corner" | "edge" | "playerStart";

export const ZONE_BOUNDS: Record<
  SpawnZone,
  { minX: number; maxX: number; minY: number; maxY: number }
> = {
  playerStart: {
    minX: SPAWN_MARGIN,
    maxX: SPAWN_MARGIN + 400,
    minY: SPAWN_MARGIN,
    maxY: SPAWN_MARGIN + 400,
  },
  edge: {
    minX: SPAWN_MARGIN,
    maxX: WORLD_WIDTH - SPAWN_MARGIN,
    minY: SPAWN_MARGIN,
    maxY: WORLD_HEIGHT - SPAWN_MARGIN,
  },
  corner: {
    minX: WORLD_WIDTH - 800,
    maxX: WORLD_WIDTH - SPAWN_MARGIN,
    minY: WORLD_HEIGHT - 800,
    maxY: WORLD_HEIGHT - SPAWN_MARGIN,
  },
  centerNest: {
    minX: NEST_CENTER.x - 300,
    maxX: NEST_CENTER.x + 300,
    minY: NEST_CENTER.y - 300,
    maxY: NEST_CENTER.y + 300,
  },
};

export function randomInZone(zone: SpawnZone): { x: number; y: number } {
  const b = ZONE_BOUNDS[zone];
  return {
    x: b.minX + Math.random() * (b.maxX - b.minX),
    y: b.minY + Math.random() * (b.maxY - b.minY),
  };
}

export const SHAPE_SPAWN_COUNTS: Record<
  "triangle" | "square" | "pentagon" | "hexagon",
  number
> = {
  triangle: 40,
  square: 30,
  pentagon: 15,
  hexagon: 5,
};

export const NEST_PULSE_INTERVAL_MS = 30000;
export const NEST_PULSE_COUNT = 6;
