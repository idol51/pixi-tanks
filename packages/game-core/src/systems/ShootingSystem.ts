import { EntityManager } from "../ecs/EntityManager";
import { System } from "../ecs/System";
import { spawnBullet } from "../factories/BulletFactory";
import { Body } from "matter-js";
import { Viewport } from "pixi-viewport";
import { gameEvents } from "../GameEvents";

export class ShootingSystem implements System {
  constructor(private viewport: Viewport) {}

  update(em: EntityManager) {
    const entities = em.queryByComponents("Turret", "PhysicsBody", "Input");
    for (const entity of entities) {
      const turret = entity.getComponent("Turret")!;
      const physicsBody = entity.getComponent("PhysicsBody")!;
      const input = entity.getComponent("Input")!;
      const stats = entity.getComponent("Stats");

      const pos = physicsBody.body.position;
      if (!turret || !pos) continue;

      const angle = turret.container.rotation;
      const tankStats = stats?.getStats();

      for (const barrel of turret.getBarrels()) {
        if (!barrel.canFire() || !input.isShooting) continue;

        const globalAngle = angle + barrel.angleOffset;
        const dx = Math.cos(globalAngle);
        const dy = Math.sin(globalAngle);

        const spawnX = pos.x + barrel.offset.x * dx - barrel.offset.y * dy;
        const spawnY = pos.y + barrel.offset.x * dy + barrel.offset.y * dx;

        spawnBullet(
          em,
          this.viewport,
          spawnX,
          spawnY,
          globalAngle,
          entity.id,
          entity.getComponent("Collision")?.config.teamId,
          tankStats
        );
        barrel.recordFire();

        gameEvents.emit("combatFx", {
          type: "shoot",
          x: spawnX,
          y: spawnY,
          color: tankStats?.color,
          sourceId: entity.id,
        });

        const recoil = {
          x: -Math.cos(angle) * barrel.recoil,
          y: -Math.sin(angle) * barrel.recoil,
        };
        Body.applyForce(physicsBody.body, physicsBody.body.position, recoil);
      }
    }
  }
}
