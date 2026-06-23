import { Engine, Events, IEventCollision } from "matter-js";
import { EntityManager } from "../ecs/EntityManager";
import { engine } from "../physics/engine";
import { getEntityFromBody } from "../utils/bodyEntityMap";
import { reflectBullet } from "../utils/reflectBullet";
import { destroyEntity } from "../utils/destroyEntity";
import { Entity } from "../ecs/Entity";
import { DamageFlashComponent } from "../components/DamageFlashComponent";
import { gameEvents } from "../GameEvents";
import { CollisionConfig } from "../components/CollisionComponent";
import { isFriendlyFire } from "../utils/friendlyFire";

import { System } from "../ecs/System";

export class CollisionSystem extends System {
  constructor(private em: EntityManager) {
    super();
    Events.on(engine, "collisionStart", this.handleCollision);
  }

  destroy() {
    Events.off(engine, "collisionStart", this.handleCollision);
  }

  private flashEntity(entity: Entity) {
    let flash = entity.getComponent("DamageFlash");
    if (!flash) {
      flash = new DamageFlashComponent();
      entity.addComponent("DamageFlash", flash);
    }
    flash.trigger();
  }

  private applyBulletHit(
    bulletEntity: Entity,
    targetEntity: Entity,
    bulletCol: { config: CollisionConfig },
    targetCol: { config: CollisionConfig }
  ) {
    const health = targetEntity.getComponent("Health");
    if (!health) return;

    const bulletComp = bulletEntity.getComponent("Bullet");
    const penetration = bulletComp?.penetration ?? bulletCol.config.damage ?? 10;
    const armor = targetCol.config.armor ?? 0;
    const baseDamage = bulletCol.config.damage ?? 10;

    let damage = baseDamage;
    let destroyBullet = !bulletCol.config.piercing;

    if (penetration < armor) {
      damage = baseDamage * 0.5;
      destroyBullet = true;
    }

    health.takeDamage(damage, bulletCol.config.ownerId);
    this.flashEntity(targetEntity);

    const ai = targetEntity.getComponent("AIController");
    const ownerId = bulletCol.config.ownerId;
    if (ai && ownerId) {
      ai.setThreat(ownerId);
    }

    const targetPhysics = targetEntity.getComponent("PhysicsBody");
    if (targetPhysics) {
      gameEvents.emit("combatFx", {
        type: "hit",
        x: targetPhysics.body.position.x,
        y: targetPhysics.body.position.y,
        targetId: targetEntity.id,
        sourceId: bulletCol.config.ownerId,
      });
    }

    if (targetEntity.id === "player") {
      gameEvents.emit("playerHit");
    }

    if (targetCol.config.reflect) {
      reflectBullet(bulletEntity);
      return;
    }

    if (destroyBullet) {
      destroyEntity(this.em, bulletEntity);
    }
  }

  private tryBulletHit(bulletEntity: Entity, targetEntity: Entity) {
    const bulletCol = bulletEntity.getComponent("Collision");
    const targetCol = targetEntity.getComponent("Collision");
    if (!bulletCol || !targetCol) return;

    if (bulletCol.config.group !== "bullet") return;

    if (targetCol.config.group === "obstacle") {
      destroyEntity(this.em, bulletEntity);
      return;
    }

    if (
      targetCol.config.group !== "tank" &&
      targetCol.config.group !== "shape"
    ) {
      return;
    }

    if (
      bulletCol.config.ownerId &&
      targetEntity.id === bulletCol.config.ownerId
    ) {
      return;
    }

    if (isFriendlyFire(bulletCol.config, targetCol.config)) return;

    this.applyBulletHit(bulletEntity, targetEntity, bulletCol, targetCol);
  }

  private handleBulletTargetPair(
    entityA: Entity,
    entityB: Entity | undefined
  ) {
    if (!entityB) return;

    const colA = entityA.getComponent("Collision");
    const colB = entityB.getComponent("Collision");
    if (!colA || !colB) return;

    if (colA.config.group === "bullet") {
      this.tryBulletHit(entityA, entityB);
    } else if (colB.config.group === "bullet") {
      this.tryBulletHit(entityB, entityA);
    }
  }

  private applyBodyDamage(entityA: Entity, entityB: Entity) {
    const colA = entityA.getComponent("Collision");
    const colB = entityB.getComponent("Collision");
    if (!colA || !colB) return;

    const bodyDamageA = colA.config.bodyDamage ?? 0;
    const bodyDamageB = colB.config.bodyDamage ?? 0;
    if (bodyDamageA === 0 && bodyDamageB === 0) return;

    const velA = entityA.getComponent("PhysicsBody")?.body.velocity;
    const velB = entityB.getComponent("PhysicsBody")?.body.velocity;
    if (!velA || !velB) return;

    const relSpeed = Math.hypot(velA.x - velB.x, velA.y - velB.y);
    if (relSpeed < 0.5) return;

    if (
      colA.config.teamId &&
      colA.config.teamId === colB.config.teamId &&
      colA.config.teamId === "ally"
    ) {
      return;
    }

    const damageScale = relSpeed * 0.15;

    if (bodyDamageA > 0) {
      const healthB = entityB.getComponent("Health");
      healthB?.takeDamage(bodyDamageA * damageScale, entityA.id);
      this.flashEntity(entityB);
    }
    if (bodyDamageB > 0) {
      const healthA = entityA.getComponent("Health");
      healthA?.takeDamage(bodyDamageB * damageScale, entityB.id);
      this.flashEntity(entityA);
    }
  }

  private handleCollision = (event: IEventCollision<Engine>) => {
    for (const pair of event.pairs) {
      const entityA = getEntityFromBody(pair.bodyA);
      const entityB = getEntityFromBody(pair.bodyB);

      if (entityA) this.handleBulletTargetPair(entityA, entityB);
      if (entityB) this.handleBulletTargetPair(entityB, entityA);
      if (entityA && entityB) this.applyBodyDamage(entityA, entityB);
    }
  };

  update(_em: EntityManager, _delta?: number) {}
}
