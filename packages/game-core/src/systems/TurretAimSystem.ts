import { Viewport } from "pixi-viewport";
import { EntityManager } from "../ecs/EntityManager";
import { System } from "../ecs/System";
import { Graphics } from "pixi.js";

export class TurretAimingSystem implements System {
  crosshair: Graphics;
  constructor(private viewport: Viewport) {
    const crosshair = new Graphics();
    crosshair
      .moveTo(-6, -6)
      .lineTo(6, 6)
      .moveTo(6, -6)
      .lineTo(-6, 6)
      .stroke({ width: 3, color: "white" });
    crosshair.zIndex = 1000;
    this.crosshair = crosshair;
    this.viewport.addChild(crosshair);
  }

  update(manager: EntityManager) {
    const entities = manager.queryByComponents("Turret", "Input", "PhysicsBody");
    for (const e of entities) {
      const turret = e.getComponent("Turret");
      const input = e.getComponent("Input");
      const physicsBody = e.getComponent("PhysicsBody");

      if (!turret || !input || !physicsBody) continue;

      const { pointerPosition } = input;
      const worldPos = this.viewport.toWorld(
        pointerPosition.x,
        pointerPosition.y
      );
      const tankPos = physicsBody.body.position;

      this.crosshair.position.set(worldPos.x, worldPos.y);

      const angle = Math.atan2(
        worldPos.y - tankPos.y,
        worldPos.x - tankPos.x
      );
      turret.setRotation(angle);
    }
  }
}
