import { Component } from "../ecs/Component";

export class PendingDestroyComponent implements Component {
  ticksRemaining: number;

  constructor(ticksRemaining = 2) {
    this.ticksRemaining = ticksRemaining;
  }
}
