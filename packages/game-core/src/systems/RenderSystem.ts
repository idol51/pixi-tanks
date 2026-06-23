import { Viewport } from "pixi-viewport";
import { EntityManager } from "../ecs/EntityManager";
import { System } from "../ecs/System";
import { attachSpriteToViewport } from "../utils/attachSprite";

export class RenderSystem extends System {
  constructor(private viewport: Viewport) {
    super();
  }

  update(manager: EntityManager): void {
    const entities = manager.queryByComponents("PhysicsBody", "Sprite");

    for (const entity of entities) {
      const physicsBody = entity.getComponent("PhysicsBody")!;
      const sprite = entity.getComponent("Sprite")!;
      const turret = entity.getComponent("Turret");
      const flash = entity.getComponent("DamageFlash");

      attachSpriteToViewport(this.viewport, sprite);

      sprite.sprite.position.set(
        physicsBody.body.position.x,
        physicsBody.body.position.y
      );
      sprite.sprite.rotation = physicsBody.body.angle;

      if (flash && flash.flashTicks > 0) {
        sprite.sprite.tint = 0xff6666;
        flash.flashTicks -= 1;
      } else {
        sprite.sprite.tint = sprite.baseTint;
      }

      if (turret) {
        turret.setPosition(physicsBody.body.position);
      }
    }
  }
}
