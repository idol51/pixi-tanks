import { Component } from "../ecs/Component";

export type AIState = "Patrol" | "Farm" | "Engage" | "Flee";

export class AIControllerComponent implements Component {
  state: AIState = "Patrol";
  targetId: string | null = null;
  lastSeen = 0;
  fireCooldown = 800;
  lastFiredAt = 0;
  tier = 1;
  aimJitter = 0.05;
  reactionDelay = 0;
  threatId: string | null = null;
  underFireUntil = 0;
  patrolAngle = Math.random() * Math.PI * 2;
  strafeUntil = 0;
  strafeDir = 1;

  constructor(
    public team?: string,
    options?: { tier?: number; aimJitter?: number; reactionDelay?: number }
  ) {
    this.tier = options?.tier ?? 1;
    this.aimJitter = options?.aimJitter ?? 0.05 / this.tier;
    this.reactionDelay = options?.reactionDelay ?? 200 / this.tier;
  }

  setState(state: AIState) {
    this.state = state;
  }

  setThreat(attackerId: string, durationMs = 2500) {
    this.threatId = attackerId;
    this.underFireUntil = performance.now() + durationMs;
    if (this.tier >= 2) {
      this.strafeUntil = performance.now() + 400;
      this.strafeDir = Math.random() > 0.5 ? 1 : -1;
    }
  }
}
