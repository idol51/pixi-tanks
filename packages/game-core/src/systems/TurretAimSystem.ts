import { Viewport } from "pixi-viewport";
import { EntityManager } from "../ecs/EntityManager";
import { System } from "../ecs/System";
import { Graphics } from "pixi.js";

export class TurretAimingSystem implements System {
  crosshair: Graphics;
  constructor(private viewport: Viewport) {
    const crosshair = new Graphics();
    crosshair
      .moveTo(-5, -5)
      .lineTo(5, 5)
      .moveTo(5, -5)
      .lineTo(-5, 5)
      .stroke({ width: 2, color: "red" });
    crosshair.zIndex = 1000;
    this.crosshair = crosshair;
    this.viewport.addChild(crosshair);
  }

  update(manager: EntityManager) {
    const entities = manager.queryByComponents("Turret", "Input");
    for (const e of entities) {
      const turret = e.getComponent("Turret");
      const input = e.getComponent("Input");

      if (!turret || !input) continue;

      const { pointerPosition } = input;

      const dx = pointerPosition.x - this.viewport.screenWidth / 2;
      const dy = pointerPosition.y - this.viewport.screenHeight / 2;

      const { x, y } = this.viewport.corner;
      this.crosshair.position.set(pointerPosition.x + x, pointerPosition.y + y);
      const angle = Math.atan2(dy, dx);
      turret.setRotation(angle);
    }
  }
}
