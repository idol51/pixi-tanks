import { Entity } from "../ecs/Entity";
import { Body } from "matter-js";

export function reflectBullet(bullet: Entity) {
  const physics = bullet.getComponent("PhysicsBody");
  if (!physics) return;

  // Reflect in Matter.js too
  Body.setVelocity(physics.body, {
    x: -physics.body.velocity.x,
    y: -physics.body.velocity.y,
  });

  // Optional: change owner ID to undefined
  // or mark as "reflected"
}
