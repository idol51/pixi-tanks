import { EntityManager } from "../ecs/EntityManager";
import { System } from "../ecs/System";
import { spawnBullet } from "../factories/BulletFactory";
import { Body } from "matter-js";

export class ShootingSystem implements System {
  update(em: EntityManager) {
    const entities = em.queryByComponents("Turret", "PhysicsBody", "Input");
    for (const entity of entities) {
      const turret = entity.getComponent("Turret")!;
      const physicsBody = entity.getComponent("PhysicsBody")!;
      const input = entity.getComponent("Input")!;

      const pos = physicsBody.body.position;

      if (!turret || !pos) continue;

      const angle = turret.container.rotation;

      for (const barrel of turret.getBarrels()) {
        if (!barrel.canFire() || !input.isShooting) continue;

        const globalAngle = angle + barrel.angleOffset;
        const dx = Math.cos(globalAngle);
        const dy = Math.sin(globalAngle);

        const spawnX = pos.x + barrel.offset.x * dx - barrel.offset.y * dy;
        const spawnY = pos.y + barrel.offset.x * dy + barrel.offset.y * dx;

        spawnBullet(em, spawnX, spawnY, globalAngle, entity.id);
        barrel.recordFire();

        const recoil = {
          x: -Math.cos(angle) * barrel.recoil,
          y: -Math.sin(angle) * barrel.recoil,
        };
        Body.applyForce(physicsBody.body, physicsBody.body.position, recoil);
      }
    }
  }
}
