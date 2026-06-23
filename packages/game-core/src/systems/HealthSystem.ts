import { EntityManager } from "../ecs/EntityManager";
import { System } from "../ecs/System";
import { destroyEntity } from "../utils/destroyEntity";
import { grantKillRewards } from "../utils/scoring";
import { PendingDestroyComponent } from "../components/PendingDestroyComponent";
import { gameEvents } from "../GameEvents";
import { Viewport } from "pixi-viewport";

export class HealthSystem extends System {
  constructor(private viewport: Viewport) {
    super();
  }

  update(manager: EntityManager, delta = 16): void {
    const entities = manager.queryByComponents("Health");

    for (const entity of entities) {
      const health = entity.getComponent("Health")!;

      if (health.regenRate > 0 && !health.isDead()) {
        health.heal(health.regenRate * (delta / 1000));
      }

      if (health.isDead() && !entity.hasComponent("PendingDestroy")) {
        grantKillRewards(manager, entity, this.viewport);
        const physics = entity.getComponent("PhysicsBody");
        if (physics) {
          gameEvents.emit("combatFx", {
            type: "death",
            x: physics.body.position.x,
            y: physics.body.position.y,
            color: entity.getComponent("Stats")?.getStats().color,
            targetId: entity.id,
          });
        }
        entity.addComponent("PendingDestroy", new PendingDestroyComponent(2));
      }
    }

    const pending = manager.queryByComponents("PendingDestroy");
    for (const entity of pending) {
      const pendingDestroy = entity.getComponent("PendingDestroy")!;
      pendingDestroy.ticksRemaining -= 1;
      if (pendingDestroy.ticksRemaining <= 0) {
        destroyEntity(manager, entity);
      }
    }
  }
}
