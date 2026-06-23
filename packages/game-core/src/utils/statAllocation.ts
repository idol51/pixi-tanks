import { Entity } from "../ecs/Entity";
import { UpgradeableStat } from "../data/stat-allocation";
import { syncBarrelCooldowns } from "./fireFromTurret";

export function applyStatSideEffects(
  entity: Entity,
  stat: UpgradeableStat,
  delta: 1 | -1
) {
  const stats = entity.getComponent("Stats");
  const health = entity.getComponent("Health");
  if (!stats || !health) return;

  if (stat === "maxHealth") {
    const baseMax = stats.getBaseStats().maxHealth;
    const bonus = Math.floor(baseMax * 0.1);
    if (delta === 1) {
      health.max += bonus;
      health.current += bonus;
    } else {
      health.max = Math.max(baseMax, health.max - bonus);
      health.current = Math.min(health.current, health.max);
    }
  }

  if (stat === "healthRegen") {
    health.regenRate += delta === 1 ? 0.2 : -0.2;
    health.regenRate = Math.max(0, health.regenRate);
  }

  syncBarrelCooldowns(entity);
}
