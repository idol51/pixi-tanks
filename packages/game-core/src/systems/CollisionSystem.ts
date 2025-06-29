import { Engine, Events, IEventCollision } from "matter-js";
import { EntityManager } from "../ecs/EntityManager";
import { engine } from "../physics/engine";
import { getEntityFromBody } from "../utils/bodyEntityMap";
import { reflectBullet } from "../utils/reflectBullet";
import { destroyEntity } from "../utils/destroyEntity";

export class CollisionSystem {
  constructor(private em: EntityManager) {
    Events.on(engine, "collisionStart", this.handleCollision);
  }

  private handleCollision = (event: IEventCollision<Engine>) => {
    for (const pair of event.pairs) {
      const a = pair.bodyA;
      const b = pair.bodyB;

      const entityA = getEntityFromBody(a);
      const entityB = getEntityFromBody(b);

      if (!entityA || !entityB) continue;

      const colA = entityA.getComponent("Collision");
      const healthA = entityA.getComponent("Health");

      const colB = entityB.getComponent("Collision");
      const healthB = entityB.getComponent("Health");

      if (!colA || !colB) continue;

      // Skip self-hit
      if (
        (colA.config.ownerId && entityB.id === colA.config.ownerId) ||
        (colB.config.ownerId && entityA.id === colB.config.ownerId)
      )
        continue;

      // Skip friendly fire
      if (colA.config.teamId && colA.config.teamId === colB.config.teamId)
        continue;

      if (colA.config.group === "bullet" && colB.config.group === "tank") {
        healthB?.takeDamage(colA.config.damage || 0);

        // AOE
        // if (colA.config.aoeRadius) {
        //   applyAoEDamage(entityB, colA.config.aoeRadius!, colA.config.damage!);
        // }

        // Reflect
        if (colB.config.reflect) {
          reflectBullet(entityA);
          continue;
        }

        // Destroy bullet unless it's piercing
        if (!colA.config.piercing) {
          destroyEntity(this.em, entityA);
        }
      }

      if (colB.config.group === "bullet" && colA.config.group === "tank") {
        healthA?.takeDamage(colB.config.damage || 0);

        // AOE
        // if (colB.config.aoeRadius) {
        //   applyAoEDamage(entityB, colB.config.aoeRadius!, colB.config.damage!);
        // }

        // Reflect
        if (colA.config.reflect) {
          reflectBullet(entityB);
          continue;
        }

        // Destroy bullet unless it's piercing
        if (!colB.config.piercing) {
          destroyEntity(this.em, entityB);
        }
      }
    }
  };

  update() {
    // Optional future logic
  }
}
