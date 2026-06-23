import { EntityManager } from "../ecs/EntityManager";
import { System } from "../ecs/System";
import { destroyEntity } from "../utils/destroyEntity";
import { getDistance } from "../utils/getDistance";

export class BulletLifetimeSystem extends System {
  update(em: EntityManager): void {
    const bullets = em.queryByComponents("Bullet", "PhysicsBody");
    const now = performance.now();

    for (const bullet of bullets) {
      const bulletComp = bullet.getComponent("Bullet")!;
      const physics = bullet.getComponent("PhysicsBody")!;
      const pos = physics.body.position;

      const age = now - bulletComp.spawnTime;
      const dist = getDistance(
        { x: bulletComp.spawnX, y: bulletComp.spawnY },
        pos
      );

      if (age > bulletComp.maxLifetimeMs || dist > bulletComp.maxDistance) {
        destroyEntity(em, bullet);
      }
    }
  }
}
