import { describe, it, expect } from "vitest";
import { TANK_CLASS_TREE } from "../../data/tank-classes";
import { ProgressionComponent } from "../../components/ProgressionComponent";
import { DEFAULT_TANK_STATS, MAX_BULLET_SPEED, clampBulletSpeed } from "../../data/tank-stats";
import { shapeStats } from "../../factories/WanderingShapeFactory";

describe("balance sanity", () => {
  it("basic reload is slower than machineGun (higher shots/sec)", () => {
    const basic = TANK_CLASS_TREE.basic.stats.reload;
    const mg = TANK_CLASS_TREE.machineGun.stats.reload;
    expect(mg).toBeGreaterThan(basic);
  });

  it("sniper has moderated bullet damage vs old one-shot values", () => {
    expect(TANK_CLASS_TREE.sniper.stats.bulletDamage).toBeLessThanOrEqual(40);
  });

  it("annihilator has higher bullet damage than basic but not extreme reload", () => {
    const basic = TANK_CLASS_TREE.basic.stats;
    const ann = TANK_CLASS_TREE.annihilator.stats;
    expect(ann.bulletDamage).toBeGreaterThan(basic.bulletDamage);
    expect(ann.reload).toBeLessThan(basic.reload);
  });

  it("basic tank cannot one-shot triangle at zero allocations", () => {
    const damage = DEFAULT_TANK_STATS.bulletDamage;
    const triangleHp = shapeStats.triangle.health;
    expect(damage).toBeLessThan(triangleHp);
  });

  it("tier-3 brawler path has more maxHealth than tier-1 twin", () => {
    expect(TANK_CLASS_TREE.brawler.stats.maxHealth).toBeGreaterThan(
      TANK_CLASS_TREE.twin.stats.maxHealth
    );
  });

  it("XP curve reaches level 15 under reasonable total XP", () => {
    const prog = new ProgressionComponent();
    let totalXp = 0;
    while (prog.level < 15) {
      totalXp += prog.xpToNextLevel();
      prog.addXp(prog.xpToNextLevel());
    }
    // Softer early curve: ~15xp triangles need fewer farms than old 100-base curve.
    expect(totalXp).toBeLessThan(3500);
    expect(totalXp).toBeGreaterThan(800);
  });

  it("no class exceeds max bullet speed after clamp", () => {
    for (const def of Object.values(TANK_CLASS_TREE)) {
      expect(clampBulletSpeed(def.stats.bulletSpeed)).toBeLessThanOrEqual(
        MAX_BULLET_SPEED
      );
    }
  });
});
