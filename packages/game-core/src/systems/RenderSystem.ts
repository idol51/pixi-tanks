import { Viewport } from "pixi-viewport";
import { EntityManager } from "../ecs/EntityManager";
import { System } from "../ecs/System";

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

      this.viewport.addChild(sprite.sprite);

      sprite.sprite.position.set(
        physicsBody.body.position.x,
        physicsBody.body.position.y
      );

      if (turret) {
        this.viewport.addChild(turret.getView());
        turret.setPosition(physicsBody.body.position);
      }
    }
  }
}
