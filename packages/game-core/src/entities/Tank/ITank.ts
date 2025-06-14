// packages/game-core/src/entities/ITank.ts

import { Point } from "pixi.js";
import { Turret } from "../Turret/Turret";
import { TankType } from "./base-tank";

export interface ITank {
  id: string;
  name: string;
  type: TankType;

  position: Point;
  rotation: number;
  velocity: { x: number; y: number };
  health: number;
  maxHealth: number;
  score: number;

  turret: Turret;

  update(delta: number): void;
  move(direction: { x: number; y: number }): void;
  stop(): void;
  rotate(angle: number): void;
  aimTurret(angle: number): void;
  takeDamage(amount: number): void;
  isAlive(): boolean;
  getRotationAngle(): number;
}
