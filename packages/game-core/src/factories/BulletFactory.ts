import { v4 as uuid } from "uuid";
import { PhysicsBodyComponent } from "../components/PhysicsBodyComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { Graphics } from "pixi.js";
import { EntityManager } from "../ecs/EntityManager";
import { createBullet } from "../physics/createBullet";
import { CollisionComponent } from "../components/CollisionComponent";
import { BulletComponent } from "../components/BulletComponent";
import { BaseTankStats, clampBulletSpeed } from "../data/tank-stats";
import { Viewport } from "pixi-viewport";
import { attachSpriteToViewport } from "../utils/attachSprite";
import { getBulletVisuals } from "../utils/bulletAppearance";

export function spawnBullet(
  em: EntityManager,
  viewport: Viewport,
  x: number,
  y: number,
  angle: number,
  ownerId: string,
  teamId?: string,
  shooterStats?: BaseTankStats
) {
  const bulletId = uuid();
  const bullet = em.createEntity("bullet-" + bulletId);

  const stats = shooterStats ?? {
    bulletSpeed: 8,
    bulletDamage: 10,
    bulletPenetration: 10,
    color: 0xffff00,
    maxHealth: 0,
    healthRegen: 0,
    speed: 0,
    reload: 1,
  };
  const speed = clampBulletSpeed(stats.bulletSpeed);
  const { radius, color } = getBulletVisuals(stats);
  const damage = stats.bulletDamage;
  const penetration = stats.bulletPenetration;

  const bulletBody = createBullet({ x, y, angle, speed, radius, ownerId });

  const graphic = new Graphics()
    .circle(0, 0, radius)
    .fill(color)
    .circle(0, 0, radius)
    .stroke({ width: 1.5, color: 0xffffff, alpha: 0.35 });
  const sprite = new SpriteComponent(graphic);
  attachSpriteToViewport(viewport, sprite);

  bullet.addComponent("PhysicsBody", new PhysicsBodyComponent(bulletBody, bullet));
  bullet.addComponent("Sprite", sprite);
  bullet.addComponent(
    "Collision",
    new CollisionComponent({
      group: "bullet",
      ownerId,
      teamId,
      damage,
    })
  );
  bullet.addComponent(
    "Bullet",
    new BulletComponent(x, y, {
      maxDistance: 750,
      maxLifetimeMs: 3000,
      damage,
      penetration,
    })
  );

  return bullet;
}
