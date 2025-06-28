import { System } from "../ecs/System";
import { EntityManager } from "../ecs/EntityManager";

export class HealthBarSystem implements System {
  update(em: EntityManager): void {
    const entities = em.queryByComponents("Health", "HealthBar");
    for (const entity of entities) {
      const health = entity.getComponent("Health");
      const bar = entity.getComponent("HealthBar");
      if (health && bar) {
        bar.update(entity);
      }
    }
  }
}
