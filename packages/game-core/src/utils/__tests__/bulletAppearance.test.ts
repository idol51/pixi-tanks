import { describe, it, expect } from "vitest";
import { getBulletVisuals } from "../bulletAppearance";
import { DEFAULT_TANK_STATS } from "../../data/tank-stats";
import { TANK_CLASS_TREE } from "../../data/tank-classes";

describe("bullet appearance", () => {
  it("basic tank bullets are small but visible", () => {
    const { radius } = getBulletVisuals(DEFAULT_TANK_STATS);
    expect(radius).toBeGreaterThanOrEqual(6);
    expect(radius).toBeLessThanOrEqual(8);
  });

  it("destroyer bullets are larger than machine gun bullets", () => {
    const destroyer = getBulletVisuals(TANK_CLASS_TREE.destroyer.stats);
    const machineGun = getBulletVisuals(TANK_CLASS_TREE.machineGun.stats);
    expect(destroyer.radius).toBeGreaterThan(machineGun.radius);
  });

  it("uses tank color for bullet fill", () => {
    const sniper = getBulletVisuals(TANK_CLASS_TREE.sniper.stats);
    expect(sniper.color).toBe(TANK_CLASS_TREE.sniper.stats.color);
  });
});
