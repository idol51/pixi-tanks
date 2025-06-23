import { Bodies, Body, World } from "matter-js";
import { world } from "./engine";

/**
 * Creates a circular Matter.js body for a tank at given position.
 */
export function createTankBody(x: number, y: number, radius: number): Body {
  const body = Bodies.circle(x, y, radius, {
    restitution: 0.8,
    frictionAir: 0.1,
    label: "Tank",
  });

  World.add(world, body);

  Body.setPosition(body, { x, y });

  return body;
}
