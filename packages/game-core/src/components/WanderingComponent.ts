import { Component } from "../ecs/Component";
import { Entity } from "../ecs/Entity";
import { Body } from "matter-js";

export class WanderingComponent implements Component {
  timer = 0;
  interval = 1 + Math.random() * 2;
  targetDirection = { x: 0, y: 0 };
  maxForce = 0.00002; // Very slow, hover-like

  update(entity: Entity) {
    const physicsBody = entity.getComponent("PhysicsBody");

    if (!physicsBody) return;

    this.timer += 1 / 60;

    // Occasionally pick a new direction
    if (this.timer > this.interval) {
      this.timer = 0;
      this.interval = 1 + Math.random() * 2;

      // Slight random nudge
      this.targetDirection = {
        x: (Math.random() - 0.5) * this.maxForce,
        y: (Math.random() - 0.5) * this.maxForce,
      };
    }

    // Apply nudge (hover drift)
    Body.applyForce(
      physicsBody.body,
      physicsBody.body.position,
      this.targetDirection
    );
  }
}
