import { Bodies, Body, World } from "matter-js";
import { world } from "./engine";

export function createBullet({
  x,
  y,
  angle,
  radius,
  speed,
}: {
  x: number;
  y: number;
  angle: number;
  radius: number;
  speed: number;
  ownerId: string;
}) {
  const body = Bodies.circle(x, y, radius, {
    isSensor: true,
    label: "bullet",
    frictionAir: 0,
  });

  World.add(world, body);

  Body.setVelocity(body, {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed,
  });

  return body;
}
