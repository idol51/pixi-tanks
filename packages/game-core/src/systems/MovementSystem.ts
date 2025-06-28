import { System } from "../ecs/System";
import { EntityManager } from "../ecs/EntityManager";
import { Body } from "matter-js";
import { Entity } from "../ecs/Entity";

export class MovementSystem extends System {
  update(entityManager: EntityManager): void {
    const entities = entityManager.queryByComponents("Input", "PhysicsBody");

    for (const entity of entities) {
      const input = entity.getComponent("Input");
      const physicsBody = entity.getComponent("PhysicsBody");

      if (!input || !physicsBody) continue;

      const { x, y } = input.direction;
      const forceMagnitude = 0.0008;

      const magnitude = Math.sqrt(x ** 2 + y ** 2);
      if (magnitude > 0) {
        const normalizedX = x / magnitude;
        const normalizedY = y / magnitude;

        const force = {
          x: normalizedX * forceMagnitude,
          y: normalizedY * forceMagnitude,
        };

        Body.applyForce(physicsBody.body, physicsBody.body.position, force);
      }
    }
  }

  test(entity: Entity) {
    return entity.hasComponent("Input") && entity.hasComponent("PhysicsBody");
  }
}
