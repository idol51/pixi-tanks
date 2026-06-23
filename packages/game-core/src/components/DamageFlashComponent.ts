import { Component } from "../ecs/Component";

export class DamageFlashComponent implements Component {
  flashTicks = 0;

  trigger() {
    this.flashTicks = 8;
  }
}
