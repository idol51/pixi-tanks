import { Entity } from "../ecs/Entity";
import { EntityManager } from "../ecs/EntityManager";
import { createWanderingShape } from "../factories/WanderingShapeFactory";

export function spawnNest(
  em: EntityManager,
  centerX: number,
  centerY: number,
  count: number
) {
  const shapes: Entity[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const dist = 100 + Math.random() * 50;
    const x = centerX + Math.cos(angle) * dist;
    const y = centerY + Math.sin(angle) * dist;

    const shape = createWanderingShape(em, "pentagon", x, y);
    shapes.push(shape);
  }

  createWanderingShape(em, "hexagon", x, y);

  return shapes;
}
