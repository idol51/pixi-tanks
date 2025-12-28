import { BaseTankStats, TankStatMultipliers } from "../data/tank-stats";
import { Component } from "../ecs/Component";

export class StatsComponent implements Component {
  private multipliers = new Map<keyof TankStatMultipliers, number>([
    ["bulletDamage", 1],
    ["bulletPenetration", 1],
    ["bulletSpeed", 1],
    ["healthRegen", 1],
    ["maxHealth", 1],
    ["reload", 1],
    ["speed", 1],
  ]);
  private stats = new Map<keyof BaseTankStats, number>();
  constructor(stats: BaseTankStats) {
    for (const [key, value] of Object.entries(stats)) {
      this.stats.set(key as keyof BaseTankStats, value);
    }
  }

  getStats(): BaseTankStats {
    return {
      maxHealth:
        this.stats.get("maxHealth")! * (this.multipliers.get("maxHealth") ?? 1),
      healthRegen:
        this.stats.get("healthRegen")! *
        (this.multipliers.get("healthRegen") ?? 1),
      speed: this.stats.get("speed")! * (this.multipliers.get("speed") ?? 1),
      reload: this.stats.get("reload")! / (this.multipliers.get("reload") ?? 1), // ↓ reload time = ↑ fire rate
      bulletDamage:
        this.stats.get("bulletDamage")! *
        (this.multipliers.get("bulletDamage") ?? 1),
      bulletPenetration:
        this.stats.get("bulletPenetration")! *
        (this.multipliers.get("bulletPenetration") ?? 1),
      bulletSpeed:
        this.stats.get("bulletSpeed")! *
        (this.multipliers.get("bulletSpeed") ?? 1),
      color: this.stats.get("color")!,
    };
  }

  incrementStat(stat: keyof TankStatMultipliers) {
    this.multipliers.set(stat, (this.multipliers.get(stat) || 1) + 0.1);
  }
}
