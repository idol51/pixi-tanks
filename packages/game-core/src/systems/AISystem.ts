import { EntityManager } from "../ecs/EntityManager";
import { System } from "../ecs/System";
import { spawnBullet } from "../factories/BulletFactory";
import { getDistance } from "../utils/getDistance";
import { Body } from "matter-js";

export class AISystem implements System {
  update(em: EntityManager) {
    const aiEntities = em.queryByComponents("AIController", "PhysicsBody");

    for (const entity of aiEntities) {
      const ai = entity.getComponent("AIController")!;
      const physicsBody = entity.getComponent("PhysicsBody")!;

      const pos = physicsBody.body.position;

      // 1️⃣ Find nearest player tank
      const targets = em
        .queryByComponents("PhysicsBody")
        .filter((e) => e !== entity && e.id === "player");

      const nearest = targets.reduce((prev, curr) => {
        const prevDist = getDistance(
          pos,
          prev.getComponent("PhysicsBody")!.body.position
        );
        const currDist = getDistance(
          pos,
          curr.getComponent("PhysicsBody")!.body.position
        );
        return currDist < prevDist ? curr : prev;
      }, targets[0]);

      if (!nearest) continue;

      const nearestBody = nearest.getComponent("PhysicsBody")!;
      const targetPos = nearestBody.body.position;
      const dx = targetPos.x - pos.x;
      const dy = targetPos.y - pos.y;
      const angle = Math.atan2(dy, dx);
      const dist = Math.sqrt(dx * dx + dy * dy);

      // 2️⃣ Aim & Move
      const turret = entity.getComponent("Turret");
      if (turret) turret.setRotation(angle);

      if (dist > 150) {
        Body.setVelocity(physicsBody.body, { x: dx / dist, y: dy / dist });
      } else {
        Body.setVelocity(physicsBody.body, { x: 0, y: 0 });
      }

      // 3️⃣ Fire if close and cooldown over
      const now = performance.now();
      if (dist < 400 && now - ai.lastFiredAt > ai.fireCooldown) {
        spawnBullet(em, pos.x, pos.y, angle, entity.id, "enemy");
        ai.lastFiredAt = now;
      }
    }
  }
}
