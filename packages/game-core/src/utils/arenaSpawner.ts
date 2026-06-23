import { EntityManager } from "../ecs/EntityManager";
import {
  createWanderingShape,
  ShapeType,
} from "../factories/WanderingShapeFactory";
import { SHAPE_SPAWN_COUNTS, randomInZone, SpawnZone } from "../data/world";
import { Viewport } from "pixi-viewport";
import { spawnObstacleCluster } from "../factories/ObstacleFactory";
import { pickSpawnPoint } from "./pickSpawnPoint";

const ZONE_WEIGHTS: { zone: SpawnZone; types: ShapeType[] }[] = [
  { zone: "edge", types: ["triangle", "square"] },
  { zone: "centerNest", types: ["pentagon", "hexagon"] },
  { zone: "corner", types: ["square", "pentagon"] },
];

const STARTER_SHAPE_COUNT = 10;

export function spawnShapesInArena(
  em: EntityManager,
  viewport: Viewport,
  extraCount = 0
) {
  for (const [type, count] of Object.entries(SHAPE_SPAWN_COUNTS) as [
    ShapeType,
    number,
  ][]) {
    for (let i = 0; i < count + (type === "triangle" ? extraCount : 0); i++) {
      const zoneEntry =
        type === "hexagon" || type === "pentagon"
          ? ZONE_WEIGHTS[1]
          : ZONE_WEIGHTS[0];
      const { x, y } = randomInZone(zoneEntry.zone);
      createWanderingShape(em, type, x, y, viewport);
    }
  }

  spawnStarterCluster(em, viewport);
}

export function spawnStarterCluster(em: EntityManager, viewport: Viewport) {
  const reserved: { x: number; y: number }[] = [];
  for (let i = 0; i < STARTER_SHAPE_COUNT; i++) {
    const { x, y } = pickSpawnPoint(em, "playerStart", {
      minDist: 70,
      reservedPoints: reserved,
      avoidIds: ["player"],
    });
    reserved.push({ x, y });
    const type: ShapeType = i % 2 === 0 ? "triangle" : "square";
    createWanderingShape(em, type, x, y, viewport);
  }
}

export function spawnObstacles(em: EntityManager, viewport: Viewport) {
  const clusters = [
    { x: 1200, y: 1200 },
    { x: 3800, y: 1200 },
    { x: 1200, y: 3800 },
    { x: 3800, y: 3800 },
  ];
  for (const pos of clusters) {
    spawnObstacleCluster(em, viewport, pos.x, pos.y);
  }
}
