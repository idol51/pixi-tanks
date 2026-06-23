import { Component } from "../ecs/Component";
import type { TankClassId } from "../data/tank-classes";

export class ProgressionComponent implements Component {
  xp = 0;
  level = 1;
  score = 0;
  kills = 0;
  spawnTime = performance.now();
  statPointsEarned = 0;
  pendingClassEvolution = false;
  classEvolutionChoices: TankClassId[] = [];

  xpToNextLevel(): number {
    return Math.floor(50 * Math.pow(1.1, this.level - 1));
  }

  addXp(amount: number): boolean {
    this.xp += amount;
    this.score += amount;
    const needed = this.xpToNextLevel();
    if (this.xp >= needed) {
      this.xp -= needed;
      this.level += 1;
      // Faster early power spike: levels 2–4 grant 2 stat points each.
      this.statPointsEarned += this.level <= 4 ? 2 : 1;
      return true;
    }
    return false;
  }

  unspentStatPoints(pointsSpent: number): number {
    return this.statPointsEarned - pointsSpent;
  }
}
