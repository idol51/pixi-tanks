import { TankComponent } from "../TankComponent";
import { BaseTank } from "../base-tank";

export class MovementComponent implements TankComponent {
  update(delta: number, tank: BaseTank) {
    const stats = tank.getStats();
    tank.position.x += tank.velocity.x * delta * stats.speed;
    tank.position.y += tank.velocity.y * delta * stats.speed;
  }
}
