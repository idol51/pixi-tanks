import { EntityManager } from "../ecs/EntityManager";
import { System } from "../ecs/System";

export class HealthSystem extends System {
  update(delta: number, manager: EntityManager): void {
    const entities = manager.queryByComponents("Health");

    for (const entity of entities) {
      const health = entity.getComponent("Health")!;
      if (health.health <= 0) {
        manager.removeEntity(entity.id);
      }
    }
  }
}
