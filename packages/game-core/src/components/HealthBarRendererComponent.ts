// components/HealthBarRendererComponent.ts
import { Graphics } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Entity } from "../ecs/Entity";

export class HealthBarRendererComponent {
  bar: Graphics;
  width = 40;
  height = 6;

  constructor(public viewport: Viewport) {
    this.bar = new Graphics();
    this.viewport.addChild(this.bar);
  }

  update(entity: Entity) {
    const health = entity.getComponent("Health");
    const physicsBody = entity.getComponent("PhysicsBody");

    if (!physicsBody) return;

    const pos = physicsBody.body.position;
    const radius = physicsBody.body.circleRadius;

    if (!health || !pos || !radius) return;

    const ratio = health.current / health.max;

    this.bar.clear();

    if (ratio === 1) {
      this.bar.visible = false;
      return;
    }

    this.bar.visible = true;

    this.bar
      .rect(
        pos.x - this.width / 2,
        pos.y - radius - this.height * 2,
        this.width,
        this.height
      )
      .fill(0xff0000); // Background

    this.bar
      .rect(
        pos.x - this.width / 2,
        pos.y - radius - this.height * 2,
        this.width * ratio,
        this.height
      )
      .fill(0x00ff00); // Foreground
  }
}
