import { EntityManager } from "../ecs/EntityManager";
import { createWanderingShape } from "../factories/WanderingShapeFactory";
import { Viewport } from "pixi-viewport";

export function spawnNest(
  em: EntityManager,
  viewport: Viewport,
  centerX: number,
  centerY: number,
  count: number
) {
  const shapes = [];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const dist = 100 + Math.random() * 50;
    const x = centerX + Math.cos(angle) * dist;
    const y = centerY + Math.sin(angle) * dist;

    const shape = createWanderingShape(em, "pentagon", x, y, viewport);
    shapes.push(shape);
  }

  return shapes;
}
