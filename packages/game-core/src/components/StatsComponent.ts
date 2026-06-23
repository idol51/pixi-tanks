import { BaseTankStats, clampBulletSpeed } from "../data/tank-stats";
import {
  createEmptyAllocations,
  MAX_STAT_POINTS,
  POINT_SCALE,
  sumAllocations,
  UpgradeableStat,
  UPGRADEABLE_STATS,
} from "../data/stat-allocation";
import { Component } from "../ecs/Component";

export class StatsComponent implements Component {
  private pointAllocations = createEmptyAllocations();
  private stats = new Map<keyof BaseTankStats, number>();

  constructor(stats: BaseTankStats) {
    for (const [key, value] of Object.entries(stats)) {
      this.stats.set(key as keyof BaseTankStats, value);
    }
  }

  private pointFactor(stat: UpgradeableStat): number {
    return 1 + this.pointAllocations[stat] * POINT_SCALE;
  }

  getStats(): BaseTankStats {
    return {
      maxHealth: this.stats.get("maxHealth")! * this.pointFactor("maxHealth"),
      healthRegen:
        this.stats.get("healthRegen")! * this.pointFactor("healthRegen"),
      speed: this.stats.get("speed")! * this.pointFactor("speed"),
      reload: this.stats.get("reload")! / this.pointFactor("reload"),
      bulletDamage:
        this.stats.get("bulletDamage")! * this.pointFactor("bulletDamage"),
      bulletPenetration:
        this.stats.get("bulletPenetration")! *
        this.pointFactor("bulletPenetration"),
      bulletSpeed: clampBulletSpeed(
        this.stats.get("bulletSpeed")! * this.pointFactor("bulletSpeed")
      ),
      color: this.stats.get("color")!,
    };
  }

  getAllocation(stat: UpgradeableStat): number {
    return this.pointAllocations[stat];
  }

  getAllocations(): Record<UpgradeableStat, number> {
    return { ...this.pointAllocations };
  }

  getTotalAllocated(): number {
    return sumAllocations(this.pointAllocations);
  }

  adjustAllocation(stat: UpgradeableStat, delta: 1 | -1): boolean {
    const next = this.pointAllocations[stat] + delta;
    if (next < 0 || next > MAX_STAT_POINTS) return false;
    this.pointAllocations[stat] = next;
    return true;
  }

  setBaseStats(stats: BaseTankStats) {
    for (const [key, value] of Object.entries(stats)) {
      this.stats.set(key as keyof BaseTankStats, value);
    }
  }

  getBaseStats(): BaseTankStats {
    return {
      maxHealth: this.stats.get("maxHealth")!,
      healthRegen: this.stats.get("healthRegen")!,
      speed: this.stats.get("speed")!,
      reload: this.stats.get("reload")!,
      bulletDamage: this.stats.get("bulletDamage")!,
      bulletPenetration: this.stats.get("bulletPenetration")!,
      bulletSpeed: this.stats.get("bulletSpeed")!,
      color: this.stats.get("color")!,
    };
  }
}

export { UPGRADEABLE_STATS };
