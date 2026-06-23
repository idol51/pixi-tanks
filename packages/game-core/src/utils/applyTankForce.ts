import { Body } from "matter-js";

export const TANK_BASE_FORCE = 0.0008;
export const TANK_MAX_SPEED = 3.5;

export function applyTankForce(
  body: Body,
  dirX: number,
  dirY: number,
  speedMult = 1
) {
  const magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
  if (magnitude <= 0) return;

  const nx = dirX / magnitude;
  const ny = dirY / magnitude;
  const force = TANK_BASE_FORCE * speedMult;

  Body.applyForce(body, body.position, {
    x: nx * force,
    y: ny * force,
  });
}

export function clampTankVelocity(body: Body, maxSpeed = TANK_MAX_SPEED) {
  const { x, y } = body.velocity;
  const speed = Math.hypot(x, y);
  if (speed <= maxSpeed) return;

  const scale = maxSpeed / speed;
  Body.setVelocity(body, { x: x * scale, y: y * scale });
}

export function lerpVelocity(
  body: Body,
  targetVx: number,
  targetVy: number,
  delta: number,
  lerpRate = 0.008
) {
  const t = Math.min(1, lerpRate * delta);
  const vx = body.velocity.x + (targetVx - body.velocity.x) * t;
  const vy = body.velocity.y + (targetVy - body.velocity.y) * t;
  Body.setVelocity(body, { x: vx, y: vy });
}
