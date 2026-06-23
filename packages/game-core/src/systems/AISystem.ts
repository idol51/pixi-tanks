import { EntityManager } from "../ecs/EntityManager";
import { System } from "../ecs/System";
import { getDistance } from "../utils/getDistance";
import { fireFromTurret } from "../utils/fireFromTurret";
import {
  applyTankForce,
  clampTankVelocity,
  TANK_MAX_SPEED,
} from "../utils/applyTankForce";
import { Entity } from "../ecs/Entity";

const AGGRO_RADIUS = 450;
const FLEE_HP_RATIO = 0.25;
const ENGAGE_RANGE = 380;

export class AISystem implements System {
  constructor(private viewport: import("pixi-viewport").Viewport) {}

  update(em: EntityManager, delta = 16) {
    const now = performance.now();
    const aiEntities = em.queryByComponents("AIController", "PhysicsBody");

    for (const entity of aiEntities) {
      const ai = entity.getComponent("AIController")!;
      const physicsBody = entity.getComponent("PhysicsBody")!;
      const health = entity.getComponent("Health");
      const body = physicsBody.body;
      const pos = body.position;
      const hpRatio = health ? health.current / health.max : 1;

      const shapes = em
        .queryByComponents("Wandering", "PhysicsBody", "Health")
        .filter((s) => !s.getComponent("Health")?.isDead());

      const enemies = em
        .queryByComponents("PhysicsBody", "Collision", "Health")
        .filter((e) => {
          if (e === entity) return false;
          const col = e.getComponent("Collision")!;
          if (col.config.group !== "tank") return false;
          if (col.config.teamId && col.config.teamId === ai.team) return false;
          return true;
        });

      const nearestShape = shapes.reduce<(typeof shapes)[0] | null>(
        (best, curr) => {
          const dist = getDistance(
            pos,
            curr.getComponent("PhysicsBody")!.body.position
          );
          if (!best) return curr;
          const bestDist = getDistance(
            pos,
            best.getComponent("PhysicsBody")!.body.position
          );
          return dist < bestDist ? curr : best;
        },
        null
      );

      const nearestEnemy = enemies.reduce<(typeof enemies)[0] | null>(
        (best, curr) => {
          const dist = getDistance(
            pos,
            curr.getComponent("PhysicsBody")!.body.position
          );
          if (!best) return curr;
          const bestDist = getDistance(
            pos,
            best.getComponent("PhysicsBody")!.body.position
          );
          return dist < bestDist ? curr : best;
        },
        null
      );

      let threatTarget: Entity | null = null;
      if (ai.threatId && now < ai.underFireUntil) {
        threatTarget = em.getEntity(ai.threatId) ?? null;
        if (threatTarget?.getComponent("Health")?.isDead()) {
          threatTarget = null;
        }
      }

      let target: Entity | null = null;

      if (threatTarget) {
        ai.setState("Engage");
        target = threatTarget;
      } else if (hpRatio < FLEE_HP_RATIO && (threatTarget || nearestEnemy)) {
        ai.setState("Flee");
        target = threatTarget ?? nearestEnemy;
      } else if (nearestEnemy) {
        const dist = getDistance(
          pos,
          nearestEnemy.getComponent("PhysicsBody")!.body.position
        );
        if (dist < AGGRO_RADIUS) {
          ai.setState("Engage");
          target = nearestEnemy;
        }
      }

      if (!target && nearestShape) {
        ai.setState("Farm");
        target = nearestShape;
      }

      if (!target) {
        ai.setState("Patrol");
      }

      const turret = entity.getComponent("Turret");
      const stats = entity.getComponent("Stats");
      const speedMult = (stats?.getStats().speed ?? 1) * 0.85;

      if (!target) {
        ai.patrolAngle += (delta / 1000) * 0.4;
        applyTankForce(
          body,
          Math.cos(ai.patrolAngle),
          Math.sin(ai.patrolAngle),
          speedMult * 0.35
        );
        clampTankVelocity(body, TANK_MAX_SPEED * 0.5);
        continue;
      }

      const targetPos = target.getComponent("PhysicsBody")!.body.position;
      const dx = targetPos.x - pos.x;
      const dy = targetPos.y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      let angle = Math.atan2(dy, dx);
      angle += (Math.random() - 0.5) * ai.aimJitter;

      if (turret) turret.setRotation(angle);

      let moveX = 0;
      let moveY = 0;

      if (ai.state === "Flee") {
        moveX = -dx / dist;
        moveY = -dy / dist;
      } else if (ai.state === "Engage") {
        if (dist > 120) {
          moveX = dx / dist;
          moveY = dy / dist;
        } else if (dist < 80) {
          moveX = -dx / dist;
          moveY = -dy / dist;
        }
        if (now < ai.strafeUntil && ai.tier >= 2) {
          moveX += (-dy / dist) * ai.strafeDir * 0.6;
          moveY += (dx / dist) * ai.strafeDir * 0.6;
        }

        if (dist < ENGAGE_RANGE && now - ai.lastFiredAt > ai.fireCooldown) {
          if (
            fireFromTurret(
              em,
              this.viewport,
              entity,
              entity.getComponent("Collision")?.config.teamId
            )
          ) {
            ai.lastFiredAt = now;
          }
        }
      } else if (ai.state === "Farm") {
        if (dist > 80) {
          moveX = dx / dist;
          moveY = dy / dist;
        } else {
          const nowFarm = performance.now();
          if (nowFarm - ai.lastFiredAt > ai.fireCooldown) {
            if (
              fireFromTurret(
                em,
                this.viewport,
                entity,
                entity.getComponent("Collision")?.config.teamId
              )
            ) {
              ai.lastFiredAt = nowFarm;
            }
          }
        }
      } else {
        moveX = (dx / dist) * 0.5;
        moveY = (dy / dist) * 0.5;
      }

      if (moveX !== 0 || moveY !== 0) {
        applyTankForce(body, moveX, moveY, speedMult);
      }
      clampTankVelocity(body);
    }
  }
}
