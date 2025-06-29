import { Viewport } from "pixi-viewport";
import { EntityManager } from "../ecs/EntityManager";
import { System } from "../ecs/System";

export class TurretAimingSystem implements System {
  constructor(private viewport: Viewport) {}

  update(manager: EntityManager) {
    const entities = manager.queryByComponents("Turret", "Input");
    for (const e of entities) {
      const turret = e.getComponent("Turret");
      const input = e.getComponent("Input");

      if (!turret || !input) continue;

      const { mousePosition } = input;

      const dx = mousePosition.x - this.viewport.screenWidth / 2;
      const dy = mousePosition.y - this.viewport.screenHeight / 2;
      const angle = Math.atan2(dy, dx);
      turret.setRotation(angle);
    }
  }
}
