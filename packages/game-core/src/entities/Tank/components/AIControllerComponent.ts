// packages/game-core/src/components/AIControllerComponent.ts

import { GameWorld } from "../../../GameWorld";
import { TankComponent } from "../TankComponent";
import { BaseTank } from "../base-tank";

export class AIControllerComponent implements TankComponent {
  private fireCooldown = 2000;
  private lastFiredAt = 0;

  constructor(private world: GameWorld) {}

  update(_delta: number, tank: BaseTank) {
    const player = this.world.tanks.get(this.world.playerId);
    if (!player || !tank.isAlive()) return;

    const dx = player.x - tank.x;
    const dy = player.y - tank.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    // Rotate and aim turret
    tank.rotate(angle);
    tank.aimTurret(angle);

    // Movement logic
    if (distance > 200) {
      tank.move({ x: dx / distance, y: dy / distance });
    } else {
      tank.stop();
    }

    // Fire logic
    const now = performance.now();
    if (distance <= 500 && now - this.lastFiredAt >= this.fireCooldown) {
      this.lastFiredAt = now;
      //   TODO: fix this
      this.world.fireBullet(tank.id);
    }
  }

  onAttach(_tank: BaseTank) {}
  onDetach(_tank: BaseTank) {}
}
