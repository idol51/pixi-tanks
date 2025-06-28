import { Bodies, Body, World } from "matter-js";
import { world } from "./engine";

/**
 * Creates a circular Matter.js body for a tank at given position.
 */
export function createTankBody(x: number, y: number, radius: number): Body {
  const body = Bodies.circle(x, y, radius, {
    friction: 0, // Friction against surfaces (e.g., wall contact)
    frictionAir: 0.05, // Air resistance – higher = more drag
    restitution: 1, // Bounciness – tweak if tanks bounce
    inertia: Infinity, // Prevent unwanted rotation from physics
    inverseInertia: 0, // Locks rotation
    label: "tank",
  });

  World.add(world, body);

  Body.setPosition(body, { x, y });

  return body;
}
