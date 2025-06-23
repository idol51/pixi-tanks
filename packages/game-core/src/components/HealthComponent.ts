import { Component } from "../ecs/Component";

export class HealthComponent implements Component {
  health: number;
  constructor(public maxHealth: number) {
    this.health = maxHealth;
  }
}
