import { Entity } from "../ecs/Entity";
import { Viewport } from "pixi-viewport";
import { Body } from "matter-js";
import { getClassDef, getEvolutionChoices, TankClassId } from "../data/tank-classes";
import { syncBarrelCooldowns } from "./fireFromTurret";
import { syncVictimScoreValue } from "./scoring";
import { TankClassComponent } from "../components/TankClassComponent";
import { updateTankVisual } from "../rendering/TankVisualFactory";

export { getEvolutionChoices, getClassDef };
export type { TankClassId };

export function applyClassEvolution(
  entity: Entity,
  classId: TankClassId,
  viewport: Viewport
) {
  const classDef = getClassDef(classId);
  const stats = entity.getComponent("Stats");
  const turret = entity.getComponent("Turret");
  const sprite = entity.getComponent("Sprite");
  const collision = entity.getComponent("Collision");
  const physics = entity.getComponent("PhysicsBody");
  const health = entity.getComponent("Health");

  let tankClass = entity.getComponent("TankClass");
  if (!tankClass) {
    tankClass = new TankClassComponent(classId);
    entity.addComponent("TankClass", tankClass);
  } else {
    tankClass.classId = classId;
  }

  if (turret) {
    turret.rebuild(viewport, classDef.barrelLayout, classId);
    syncBarrelCooldowns(entity);
  }

  if (stats) {
    const oldMax = stats.getStats().maxHealth;
    stats.setBaseStats(classDef.stats);
    const newMax = stats.getStats().maxHealth;
    if (health && newMax > oldMax) {
      const bonus = newMax - oldMax;
      health.max += bonus;
      health.current += bonus;
    }
  }

  if (sprite) {
    updateTankVisual(sprite, classId, viewport, physics?.body.position);
    sprite.baseTint = classDef.bodyStyle.color;
  }

  if (physics) {
    const targetRadius = classDef.bodyStyle.radius;
    const currentRadius = (physics.body.circleRadius as number) ?? 20;
    if (currentRadius !== targetRadius) {
      const scale = targetRadius / currentRadius;
      Body.scale(physics.body, scale, scale);
    }
  }

  if (collision && stats) {
    const s = stats.getStats();
    collision.config.armor = s.bulletPenetration * 0.5;
    collision.config.bodyDamage = s.bulletDamage * 0.3;
  }

  if (entity.hasComponent("AIController")) {
    syncVictimScoreValue(entity);
  }
}
