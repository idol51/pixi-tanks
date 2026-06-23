import { EntityManager } from "../ecs/EntityManager";
import { Entity } from "../ecs/Entity";
import { getClassName, EVOLUTION_LEVELS } from "../data/tank-classes";
import { getEvolutionChoices, applyClassEvolution } from "./classEvolution";
import { Viewport } from "pixi-viewport";
import { syncVictimScoreValue } from "./scoring";

export function handleBotLevelUp(
  _em: EntityManager,
  attacker: Entity,
  viewport: Viewport
) {
  const progression = attacker.getComponent("Progression");
  if (!progression) return;

  syncVictimScoreValue(attacker);

  if (EVOLUTION_LEVELS.includes(progression.level as 15 | 30 | 45)) {
    const classId = attacker.getComponent("TankClass")?.classId ?? "basic";
    const choices = getEvolutionChoices(classId, progression.level);
    if (choices.length > 0) {
      const pick = choices[Math.floor(Math.random() * choices.length)];
      applyClassEvolution(attacker, pick, viewport);
      const name = attacker.getComponent("Name");
      if (name) {
        name.name = getClassName(pick);
      }
      syncVictimScoreValue(attacker);
    }
  }
}
