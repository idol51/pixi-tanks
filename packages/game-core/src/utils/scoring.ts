import { EntityManager } from "../ecs/EntityManager";
import { Entity } from "../ecs/Entity";
import { gameEvents } from "../GameEvents";
import { getClassDef, getClassName, EVOLUTION_LEVELS, TankClassId } from "../data/tank-classes";
import { getEvolutionChoices } from "./classEvolution";
import { Viewport } from "pixi-viewport";
import { handleBotLevelUp } from "./botEvolution";
import { UpgradeableStat } from "../data/stat-allocation";

/** Bonus XP for evolved class tier (on top of victim level × multiplier). */
function getClassXpBonus(classId: TankClassId | undefined): number {
  if (!classId || classId === "basic") return 0;
  const evolveAt = getClassDef(classId).evolveAt;
  if (evolveAt === 45) return 30;
  if (evolveAt === 30) return 20;
  if (evolveAt === 15) return 12;
  return 0;
}

export function computeKillXp(victim: Entity): number {
  const scoreValue = victim.getComponent("ScoreValue");
  const progression = victim.getComponent("Progression");

  // Shapes and other non-progression entities use their configured value.
  if (!progression) {
    return scoreValue?.xpValue ?? 10;
  }

  const victimLevel = progression.level;
  const classId = victim.getComponent("TankClass")?.classId;
  const classBonus = getClassXpBonus(classId);

  // Kill reward scales with victim level (≈ level × 10) plus class tier bonus.
  return victimLevel * 10 + classBonus;
}

export function syncVictimScoreValue(entity: Entity) {
  const scoreValue = entity.getComponent("ScoreValue");
  if (!scoreValue) return;
  const xp = computeKillXp(entity);
  scoreValue.xpValue = xp;
  scoreValue.scoreValue = xp;
}

export function grantKillRewards(
  em: EntityManager,
  victim: Entity,
  viewport?: Viewport
) {
  const attackerId = victim.getComponent("Health")?.lastAttackerId;
  if (!attackerId) return;

  const attacker = em.getEntity(attackerId);
  if (!attacker) return;

  const progression = attacker.getComponent("Progression");
  if (!progression) return;

  const xpGain = computeKillXp(victim);
  const leveledUp = progression.addXp(xpGain);
  progression.kills += 1;

  const victimName =
    victim.getComponent("Name")?.name ??
    (victim.hasComponent("Wandering") ? "Shape" : "Tank");
  const attackerName = attacker.getComponent("Name")?.name ?? attacker.id;

  gameEvents.emit("killFeed", {
    message: `${attackerName} destroyed ${victimName} (+${xpGain} XP)`,
  });

  if (leveledUp && attacker.id === "player") {
    if (EVOLUTION_LEVELS.includes(progression.level as 15 | 30 | 45)) {
      const classId = attacker.getComponent("TankClass")?.classId ?? "basic";
      const choices = getEvolutionChoices(classId, progression.level);
      progression.pendingClassEvolution = true;
      progression.classEvolutionChoices = choices;
      gameEvents.emit("classEvolution", {
        level: progression.level,
        choices,
      });
    } else {
      const stats = attacker.getComponent("Stats");
      const pointsSpent = stats?.getTotalAllocated() ?? 0;
      gameEvents.emit("statPointGained", {
        level: progression.level,
        statPointsEarned: progression.statPointsEarned,
        unspent: progression.unspentStatPoints(pointsSpent),
      });
    }
  } else if (
    leveledUp &&
    attacker.hasComponent("AIController") &&
    viewport
  ) {
    handleBotLevelUp(em, attacker, viewport);
  }

  const victimPhysics = victim.getComponent("PhysicsBody");
  if (victimPhysics) {
    gameEvents.emit("floatingText", {
      text: `+${xpGain} XP`,
      x: victimPhysics.body.position.x,
      y: victimPhysics.body.position.y,
    });
  }

  if (attacker.id === "player") {
    emitHudUpdate(em, "player");
  }

  emitScoreboard(em);
}

export type { UpgradeableStat };

export function emitScoreboard(em: EntityManager) {
  const entries = em
    .queryByComponents("Progression", "Name")
    .map((e) => ({
      id: e.id,
      name: e.getComponent("Name")!.name,
      score: e.getComponent("Progression")!.score,
    }))
    .sort((a, b) => b.score - a.score);

  const player = em.getEntity("player");
  if (player?.hasComponent("Progression") && player.hasComponent("Name")) {
    const existing = entries.find((e) => e.id === "player");
    if (!existing) {
      entries.unshift({
        id: "player",
        name: player.getComponent("Name")!.name,
        score: player.getComponent("Progression")!.score,
      });
    }
  }

  gameEvents.emit("scoreUpdate", entries);
}

export function emitHudUpdate(em: EntityManager, playerId = "player") {
  const player = em.getEntity(playerId);
  if (!player) return;

  const health = player.getComponent("Health");
  const progression = player.getComponent("Progression");
  const stats = player.getComponent("Stats");
  if (!health || !progression || !stats) return;

  const allocations = stats.getAllocations();
  const pointsSpent = stats.getTotalAllocated();

  gameEvents.emit("hudUpdate", {
    health: health.current,
    maxHealth: health.max,
    xp: progression.xp,
    xpToNext: progression.xpToNextLevel(),
    level: progression.level,
    className: getClassName(
      player.getComponent("TankClass")?.classId ?? "basic"
    ),
    classId: player.getComponent("TankClass")?.classId ?? "basic",
    statAllocations: allocations,
    statPointsEarned: progression.statPointsEarned,
    unspentStatPoints: progression.unspentStatPoints(pointsSpent),
    pendingClassEvolution: progression.pendingClassEvolution,
    classEvolutionChoices: progression.pendingClassEvolution
      ? progression.classEvolutionChoices
      : undefined,
  });
}
