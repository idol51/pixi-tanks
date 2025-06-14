// packages/game-core/src/entities/Tank/components/TurretUpgradeComponent.ts
import { TankComponent } from "../TankComponent";
import { BaseTank } from "../base-tank";

export class TurretUpgradeComponent extends TankComponent {
  private cooldownReduction: number;
  private newColor?: number;

  constructor(cooldownReduction = 200, newColor?: number) {
    super();
    this.cooldownReduction = cooldownReduction;
    this.newColor = newColor;
  }

  onAttach(tank: BaseTank) {
    if (tank.turret) {
      tank.turret.setCooldown(
        Math.max(100, tank.turret.getCooldown() - this.cooldownReduction)
      );

      if (this.newColor) {
        tank.turret.setColor(this.newColor);
      }
    }
  }

  onDetach(tank: BaseTank) {
    // Optionally revert changes if needed
  }

  update(): void {
    // No per-frame logic needed
  }
}
