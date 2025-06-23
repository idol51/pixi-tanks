import { System } from "../ecs/System";
import { EntityManager } from "../ecs/EntityManager";
import { Body } from "matter-js";
import { Entity } from "../ecs/Entity";

export class MovementSystem extends System {
  update(delta: number, entityManager: EntityManager): void {
    const entities = entityManager.queryByComponents("Input", "PhysicsBody");

    for (const entity of entities) {
      const input = entity.getComponent("Input");
      const physicsBody = entity.getComponent("PhysicsBody");

      if (!input || !physicsBody) continue;

      const { x, y } = input.direction;
      const speed = 5;

      Body.setVelocity(physicsBody.body, { x: x * speed, y: y * speed });
    }
  }

  test(entity: Entity) {
    return entity.hasComponent("Input") && entity.hasComponent("PhysicsBody");
  }
}
