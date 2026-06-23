import { Entity } from "../ecs/Entity";
import { EntityManager } from "../ecs/EntityManager";
import { world } from "../physics/engine";
import { World } from "matter-js";

export function destroyEntity(em: EntityManager, entity: Entity) {
  const physics = entity.getComponent("PhysicsBody");
  if (physics) {
    World.remove(world, physics.body);
  }

  const sprite = entity.getComponent("Sprite");
  const bar = entity.getComponent("HealthBar");
  const turret = entity.getComponent("Turret");

  if (sprite) sprite.sprite?.parent?.removeChild(sprite.sprite);
  if (bar) bar.bar?.parent?.removeChild(bar.bar);
  if (turret) turret.container?.parent?.removeChild(turret.container);

  em.removeEntity(entity.id);
}
