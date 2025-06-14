import { Graphics } from "pixi.js";
import { TankComponent } from "../TankComponent";
import { BaseTank } from "../base-tank";

// Draws a dynamic health bar above the tank.
export class HealthComponent implements TankComponent {
  private bar: Graphics;

  constructor() {
    this.bar = new Graphics();
    this.bar.zIndex = 100; // Ensure it's above tank graphics
  }

  onAttach(tank: BaseTank) {
    tank.addChild(this.bar);

    // Ensure sorting is enabled so zIndex is respected
    if (!tank.sortableChildren) {
      tank.sortableChildren = true;
    }
  }

  onDetach(tank: BaseTank) {
    tank.removeChild(this.bar);
  }

  update(_delta: number, tank: BaseTank) {
    const { health, maxHealth } = tank;
    const stats = tank.getStats();

    this.bar.clear();

    const barWidth = stats.size * 2;
    const barHeight = 6;
    const barX = -barWidth / 2;
    const barY = -stats.size - 12;
    const ratio = Math.max(0, Math.min(1, health / maxHealth)); // clamp 0-1

    // Draw background bar
    this.bar.rect(barX, barY, barWidth, barHeight).fill(0x444444);

    // Draw health fill
    const fillColor =
      ratio > 0.5 ? 0x00ff00 : ratio > 0.25 ? 0xffff00 : 0xff0000;

    this.bar.rect(barX, barY, barWidth * ratio, barHeight).fill(fillColor);
  }
}
