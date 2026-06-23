import { Entity } from "../ecs/Entity";
import { EntityManager } from "../ecs/EntityManager";
import { spawnBullet } from "../factories/BulletFactory";
import { Body } from "matter-js";
import { Viewport } from "pixi-viewport";
import { gameEvents } from "../GameEvents";

export function fireFromTurret(
  em: EntityManager,
  viewport: Viewport,
  entity: Entity,
  teamId?: string
): boolean {
  const turret = entity.getComponent("Turret");
  const physicsBody = entity.getComponent("PhysicsBody");
  const stats = entity.getComponent("Stats");
  if (!turret || !physicsBody) return false;

  const pos = physicsBody.body.position;
  const angle = turret.container.rotation;
  const tankStats = stats?.getStats();
  let fired = false;

  for (const barrel of turret.getBarrels()) {
    if (!barrel.canFire()) continue;

    const globalAngle = angle + barrel.angleOffset;
    const dx = Math.cos(globalAngle);
    const dy = Math.sin(globalAngle);

    const spawnX = pos.x + barrel.offset.x * dx - barrel.offset.y * dy;
    const spawnY = pos.y + barrel.offset.x * dy + barrel.offset.y * dx;

    spawnBullet(
      em,
      viewport,
      spawnX,
      spawnY,
      globalAngle,
      entity.id,
      teamId,
      tankStats
    );
    barrel.recordFire();
    fired = true;

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

  return fired;
}

export function syncBarrelCooldowns(entity: Entity) {
  const stats = entity.getComponent("Stats");
  const turret = entity.getComponent("Turret");
  if (!stats || !turret) return;

  const reloadMs = 1000 / stats.getStats().reload;
  for (const barrel of turret.getBarrels()) {
    barrel.cooldown = reloadMs;
  }
}
