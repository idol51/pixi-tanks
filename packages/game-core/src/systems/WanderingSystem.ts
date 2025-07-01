import { EntityManager } from "../ecs/EntityManager";
import { System } from "../ecs/System";

export class WanderingSystem extends System {
  update(em: EntityManager) {
    const entities = em.queryByComponents("Wandering", "PhysicsBody");
    for (const entity of entities) {
      const wander = entity.getComponent("Wandering");

      if (wander) {
        wander.update(entity);
      }
    }
  }
}
