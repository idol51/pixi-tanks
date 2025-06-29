import { Component } from "../ecs/Component";
import { Entity } from "../ecs/Entity";

export class AIControllerComponent implements Component {
  targetId: string | null = null;
  lastSeen: number = 0;
  fireCooldown: number = 1000;
  lastFiredAt: number = 0;

  constructor(public team: string = "enemy") {}

  updateAI(_self: Entity) {
    // AI Logic here — called by AISystem
  }
}
