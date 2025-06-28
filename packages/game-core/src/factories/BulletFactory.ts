import { v4 as uuid } from "uuid";
import { PhysicsBodyComponent } from "../components/PhysicsBodyComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { Graphics } from "pixi.js";
import { EntityManager } from "../ecs/EntityManager";
import { createBullet } from "../physics/createBullet";
import { attachEntityToBody } from "../utils/bodyEntityMap";
import { CollisionComponent } from "../components/CollisionComponent";

export function spawnBullet(
  em: EntityManager,
  x: number,
  y: number,
  angle: number,
  ownerId: string,
  teamId?: string
) {
  const bulletId = uuid();
  const bullet = em.createEntity("bullet-" + bulletId);

  const speed = 15;
  const radius = 4;

  const bulletBody = createBullet({ x, y, angle, speed, radius, ownerId });

  attachEntityToBody(bulletBody, bullet);

  bullet.addComponent("PhysicsBody", new PhysicsBodyComponent(bulletBody));
  bullet.addComponent(
    "Sprite",
    new SpriteComponent(new Graphics().circle(0, 0, radius).fill(0xffff00))
  );
  bullet.addComponent(
    "Collision",
    new CollisionComponent({
      group: "bullet",
      ownerId,
      teamId,
      damage: 10,
    })
  );

  return bullet;
}
