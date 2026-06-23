import { describe, expect, it, vi, beforeEach } from "vitest";
import { Entity } from "../../ecs/Entity";
import { EntityManager } from "../../ecs/EntityManager";
import { HealthComponent } from "../../components/HealthComponent";
import { ProgressionComponent } from "../../components/ProgressionComponent";
import { ScoreValueComponent } from "../../components/ScoreValueComponent";
import { NameComponent } from "../../components/NameComponent";
import { StatsComponent } from "../../components/StatsComponent";
import { DEFAULT_TANK_STATS } from "../../data/tank-stats";
import { gameEvents } from "../../GameEvents";
import { grantKillRewards, computeKillXp } from "../scoring";

describe("grantKillRewards", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("grants XP to attacker on shape kill", () => {
    const em = new EntityManager();
    const player = em.createEntity("player");
    player.addComponent("Progression", new ProgressionComponent());
    player.addComponent("Name", new NameComponent("Tester"));
    player.addComponent("Health", new HealthComponent(100));
    player.addComponent("Stats", new StatsComponent({ ...DEFAULT_TANK_STATS }));

    const shape = em.createEntity("shape-1");
    const health = new HealthComponent(10);
    health.lastAttackerId = "player";
    shape.addComponent("Health", health);
    shape.addComponent("ScoreValue", new ScoreValueComponent(15));
    shape.addComponent("Name", new NameComponent("Triangle"));

    const hudSpy = vi.fn();
    gameEvents.on("hudUpdate", hudSpy);

    grantKillRewards(em, shape);

    const progression = player.getComponent("Progression")!;
    expect(progression.xp).toBe(15);
    expect(progression.kills).toBe(1);
    expect(hudSpy).toHaveBeenCalled();

    gameEvents.off("hudUpdate", hudSpy);
  });

  it("does nothing without attacker id", () => {
    const em = new EntityManager();
    const shape = em.createEntity("shape-2");
    shape.addComponent("Health", new HealthComponent(0));
    shape.addComponent("ScoreValue", new ScoreValueComponent(10));

    grantKillRewards(em, shape);
    expect(em.getAllEntities()).toHaveLength(1);
  });

  it("high-level bot grants more XP than level-1 bot", () => {
    const em = new EntityManager();
    const weak = em.createEntity("bot-weak");
    weak.addComponent("Health", new HealthComponent(100));
    weak.addComponent("ScoreValue", new ScoreValueComponent(10));
    weak.addComponent("Progression", new ProgressionComponent());

    const strong = em.createEntity("bot-strong");
    strong.addComponent("Health", new HealthComponent(200));
    strong.addComponent("ScoreValue", new ScoreValueComponent(10));
    const strongProg = new ProgressionComponent();
    strongProg.level = 10;
    strong.addComponent("Progression", strongProg);

    expect(computeKillXp(strong)).toBe(100);
    expect(computeKillXp(weak)).toBe(10);
    expect(computeKillXp(strong)).toBeGreaterThan(computeKillXp(weak));
  });
});
