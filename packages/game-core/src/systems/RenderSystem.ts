import { Viewport } from "pixi-viewport";
import { EntityManager } from "../ecs/EntityManager";
import { System } from "../ecs/System";

export class RenderSystem extends System {
  constructor(private viewport: Viewport) {
    super();
  }
  update(delta: number, manager: EntityManager): void {
    const entities = manager.queryByComponents("PhysicsBody", "Sprite");

    for (const entity of entities) {
      const physicsBody = entity.getComponent("PhysicsBody")!;
      const sprite = entity.getComponent("Sprite")!;

      this.viewport.addChild(sprite.sprite);

      sprite.sprite.position.set(
        physicsBody.body.position.x,
        physicsBody.body.position.y
      );
    }
  }
}
