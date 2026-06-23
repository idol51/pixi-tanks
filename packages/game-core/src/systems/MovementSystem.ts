import { System } from "../ecs/System";
import { EntityManager } from "../ecs/EntityManager";
import { applyTankForce, clampTankVelocity } from "../utils/applyTankForce";

export class MovementSystem extends System {
  update(entityManager: EntityManager): void {
    const entities = entityManager.queryByComponents("Input", "PhysicsBody");

    for (const entity of entities) {
      const input = entity.getComponent("Input");
      const physicsBody = entity.getComponent("PhysicsBody");
      const stats = entity.getComponent("Stats");

      if (!input || !physicsBody) continue;

      const speedMult = stats?.getStats().speed ?? 1;
      applyTankForce(
        physicsBody.body,
        input.moveX,
        input.moveY,
        speedMult
      );
      clampTankVelocity(physicsBody.body);
    }
  }
}