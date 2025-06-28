import { EntityManager } from "../ecs/EntityManager";
import { System } from "../ecs/System";
import { destroyEntity } from "../utils/destroyEntity";

export class HealthSystem extends System {
  update(manager: EntityManager): void {
    const entities = manager.queryByComponents("Health");

    for (const entity of entities) {
      const health = entity.getComponent("Health")!;
      if (health.current <= 0) {
        destroyEntity(manager, entity);
      }
    }
  }
}
