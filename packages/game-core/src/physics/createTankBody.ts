import { Bodies, Body, World } from "matter-js";
import { world } from "./engine";
import { CollisionCategories } from "../components/CollisionComponent";

/**
 * Creates a circular Matter.js body for a tank at given position.
 */
export function createTankBody(x: number, y: number, radius: number): Body {
  const body = Bodies.circle(x, y, radius, {
    friction: 0,
    frictionAir: 0.05,
    restitution: 1,
    inertia: Infinity,
    inverseInertia: 0,
    label: "tank",
    collisionFilter: {
      category: CollisionCategories.TANK,
      mask:
        CollisionCategories.BULLET |
        CollisionCategories.WANDERING |
        CollisionCategories.WALL,
    },
  });

  World.add(world, body);
  Body.setPosition(body, { x, y });

  return body;
}
