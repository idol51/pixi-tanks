import { describe, expect, it } from "vitest";
import { Entity } from "../../ecs/Entity";
import { StatsComponent } from "../../components/StatsComponent";
import { TurretComponent } from "../../components/TurretComponent";
import { DEFAULT_TANK_STATS } from "../../data/tank-stats";
import { syncBarrelCooldowns } from "../fireFromTurret";
import { Barrel } from "../../components/Barrel";
import { Point } from "pixi.js";

describe("syncBarrelCooldowns", () => {
  it("sets cooldown from reload stat without triple multiplier", () => {
    const entity = new Entity("test");
    entity.addComponent(
      "Stats",
      new StatsComponent({ ...DEFAULT_TANK_STATS, reload: 1.5 })
    );

    const mockViewport = { addChild: () => {} } as never;
    entity.addComponent(
      "Turret",
      new TurretComponent([{ offset: [12, 0] }], mockViewport)
    );

    syncBarrelCooldowns(entity);

    const barrel = entity.getComponent("Turret")!.getBarrels()[0];
    expect(barrel.cooldown).toBeCloseTo(1000 / 1.5, 1);
  });
});

describe("Barrel", () => {
  it("respects configured cooldown", () => {
    const barrel = new Barrel(new Point(0, 0), 0, 500);
    expect(barrel.canFire()).toBe(true);
    barrel.recordFire();
    expect(barrel.canFire()).toBe(false);
  });
});
