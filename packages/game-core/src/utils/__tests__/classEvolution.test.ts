import { describe, it, expect } from "vitest";
import { EntityManager } from "../../ecs/EntityManager";
import { StatsComponent } from "../../components/StatsComponent";
import { TurretComponent } from "../../components/TurretComponent";
import { SpriteComponent } from "../../components/SpriteComponent";
import { TankClassComponent } from "../../components/TankClassComponent";
import { DEFAULT_TANK_STATS } from "../../data/tank-stats";
import {
  getEvolutionChoices,
  EVOLUTION_LEVELS,
} from "../../data/tank-classes";
import { applyClassEvolution } from "../classEvolution";
import { Graphics } from "pixi.js";

function mockViewport() {
  const children: unknown[] = [];
  return {
    addChild: (c: unknown) => {
      children.push(c);
      return c;
    },
    removeChild: () => {},
  } as unknown as import("pixi-viewport").Viewport;
}

describe("getEvolutionChoices", () => {
  it("returns 5 tier-1 classes from basic at level 15", () => {
    const choices = getEvolutionChoices("basic", 15);
    expect(choices).toHaveLength(5);
    expect(choices).toContain("twin");
    expect(choices).toContain("sniper");
    expect(choices).toContain("machineGun");
    expect(choices).toContain("flankGuard");
    expect(choices).toContain("brawler");
  });

  it("returns tier-2 child for twin at level 30", () => {
    const choices = getEvolutionChoices("twin", 30);
    expect(choices).toEqual(["triple"]);
  });

  it("returns tier-3 child for triple at level 45", () => {
    const choices = getEvolutionChoices("triple", 45);
    expect(choices).toEqual(["quad"]);
  });

  it("returns empty for non-evolution levels", () => {
    expect(getEvolutionChoices("basic", 10)).toEqual([]);
    expect(getEvolutionChoices("basic", 20)).toEqual([]);
  });
});

describe("EVOLUTION_LEVELS", () => {
  it("includes 15, 30, and 45", () => {
    expect(EVOLUTION_LEVELS).toEqual([15, 30, 45]);
  });
});

describe("applyClassEvolution", () => {
  it("preserves stat allocations after class change", () => {
    const em = new EntityManager();
    const entity = em.createEntity("player");
    const viewport = mockViewport();

    const stats = new StatsComponent({ ...DEFAULT_TANK_STATS });
    stats.adjustAllocation("bulletDamage", 2);
    stats.adjustAllocation("speed", 1);

    const beforeAlloc = stats.getAllocations();

    entity.addComponent("Stats", stats);
    entity.addComponent("TankClass", new TankClassComponent("basic"));
    entity.addComponent(
      "Turret",
      new TurretComponent([{ offset: [12, 0] }], viewport)
    );
    entity.addComponent("Sprite", new SpriteComponent(new Graphics()));

    applyClassEvolution(entity, "twin", viewport);

    const after = entity.getComponent("Stats")!;
    expect(after.getAllocation("bulletDamage")).toBe(
      beforeAlloc.bulletDamage
    );
    expect(after.getAllocation("speed")).toBe(beforeAlloc.speed);
    expect(entity.getComponent("TankClass")?.classId).toBe("twin");
    expect(after.getStats().reload).toBeGreaterThan(0);
  });
});
