import { EntityManager } from "../ecs/EntityManager";
import { randomInZone, SpawnZone } from "../data/world";

export type SpawnPointOptions = {
  minDist?: number;
  maxAttempts?: number;
  avoidIds?: string[];
  reservedPoints?: { x: number; y: number }[];
};

function distSq(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function collectOccupied(
  em: EntityManager,
  avoidIds: string[],
  reservedPoints: { x: number; y: number }[]
) {
  const points: { x: number; y: number }[] = [...reservedPoints];

  for (const entity of em.queryByComponents("PhysicsBody")) {
    if (avoidIds.includes(entity.id)) continue;
    const body = entity.getComponent("PhysicsBody")!.body;
    points.push({ x: body.position.x, y: body.position.y });
  }

  return points;
}

export function pickSpawnPoint(
  em: EntityManager,
  zone: SpawnZone,
  options: SpawnPointOptions = {}
): { x: number; y: number } {
  const {
    minDist = 80,
    maxAttempts = 20,
    avoidIds = [],
    reservedPoints = [],
  } = options;

  const minDistSq = minDist * minDist;
  let fallback = randomInZone(zone);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = randomInZone(zone);
    const occupied = collectOccupied(em, avoidIds, reservedPoints);
    const tooClose = occupied.some(
      (p) => distSq(candidate.x, candidate.y, p.x, p.y) < minDistSq
    );
    if (!tooClose) return candidate;
    fallback = candidate;
  }

  return fallback;
}
