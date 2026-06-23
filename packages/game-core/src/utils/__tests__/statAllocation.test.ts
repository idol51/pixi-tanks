import { describe, it, expect } from "vitest";
import { StatsComponent } from "../../components/StatsComponent";
import { ProgressionComponent } from "../../components/ProgressionComponent";
import { DEFAULT_TANK_STATS } from "../../data/tank-stats";
import { MAX_STAT_POINTS } from "../../data/stat-allocation";

describe("stat allocation", () => {
  it("starts with zero allocations", () => {
    const stats = new StatsComponent({ ...DEFAULT_TANK_STATS });
    expect(stats.getTotalAllocated()).toBe(0);
    expect(stats.getAllocation("speed")).toBe(0);
  });

  it("cannot exceed cap per stat", () => {
    const stats = new StatsComponent({ ...DEFAULT_TANK_STATS });
    for (let i = 0; i < MAX_STAT_POINTS; i++) {
      expect(stats.adjustAllocation("bulletDamage", 1)).toBe(true);
    }
    expect(stats.adjustAllocation("bulletDamage", 1)).toBe(false);
    expect(stats.getAllocation("bulletDamage")).toBe(MAX_STAT_POINTS);
  });

  it("can decrease allocation and free points", () => {
    const stats = new StatsComponent({ ...DEFAULT_TANK_STATS });
    stats.adjustAllocation("speed", 1);
    stats.adjustAllocation("speed", 1);
    expect(stats.adjustAllocation("speed", -1)).toBe(true);
    expect(stats.getAllocation("speed")).toBe(1);
  });

  it("budget invariant with progression", () => {
    const stats = new StatsComponent({ ...DEFAULT_TANK_STATS });
    const prog = new ProgressionComponent();
    prog.statPointsEarned = 3;

    stats.adjustAllocation("reload", 1);
    stats.adjustAllocation("speed", 1);
    stats.adjustAllocation("maxHealth", 1);

    expect(stats.getTotalAllocated()).toBe(3);
    expect(prog.unspentStatPoints(stats.getTotalAllocated())).toBe(0);
  });

  it("level up grants two stat points for early levels", () => {
    const prog = new ProgressionComponent();
    prog.addXp(prog.xpToNextLevel());
    expect(prog.level).toBe(2);
    expect(prog.statPointsEarned).toBe(2);
  });

  it("increases effective stats per point", () => {
    const stats = new StatsComponent({ ...DEFAULT_TANK_STATS });
    const before = stats.getStats().bulletDamage;
    stats.adjustAllocation("bulletDamage", 1);
    expect(stats.getStats().bulletDamage).toBeGreaterThan(before);
  });
});
