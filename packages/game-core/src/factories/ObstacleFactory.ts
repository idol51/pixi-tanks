import { Bodies, World } from "matter-js";
import { Graphics } from "pixi.js";
import { EntityManager } from "../ecs/EntityManager";
import { Viewport } from "pixi-viewport";
import { world } from "../physics/engine";
import { PhysicsBodyComponent } from "../components/PhysicsBodyComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { CollisionComponent } from "../components/CollisionComponent";
import { attachSpriteToViewport } from "../utils/attachSprite";
import { v4 as uuid } from "uuid";

export function spawnObstacleCluster(
  em: EntityManager,
  viewport: Viewport,
  centerX: number,
  centerY: number
) {
  const offsets = [
    [0, 0],
    [80, 0],
    [-80, 0],
    [0, 80],
  ];

  for (const [ox, oy] of offsets) {
    const id = `obstacle-${uuid()}`;
    const entity = em.createEntity(id);
    const x = centerX + ox;
    const y = centerY + oy;

    const body = Bodies.rectangle(x, y, 60, 60, { isStatic: true });
    World.add(world, body);

    const graphic = new Graphics().rect(-30, -30, 60, 60).fill(0x555555);
    const sprite = new SpriteComponent(graphic);
    attachSpriteToViewport(viewport, sprite);

    entity.addComponent("PhysicsBody", new PhysicsBodyComponent(body, entity));
    entity.addComponent("Sprite", sprite);
    entity.addComponent(
      "Collision",
      new CollisionComponent({ group: "obstacle", armor: 100 })
    );
  }
}
