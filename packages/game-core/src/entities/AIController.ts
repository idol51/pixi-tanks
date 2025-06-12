import { Tank } from "./Tank";

export class AIController {
  tank: Tank;
  lastShot = 0;

  constructor(tank: Tank) {
    this.tank = tank;
  }

  update(player: Tank, fire: (angle: number) => void) {
    if (!player) return;

    const dx = player.position.x - this.tank.position.x;
    const dy = player.position.y - this.tank.position.y;
    const angle = Math.atan2(dy, dx);

    // Face player and move toward them
    this.tank.move({ x: Math.cos(angle), y: Math.sin(angle) });
    this.tank.rotate(angle);
    this.tank.aimTurret(angle);

    const now = performance.now();
    if (now - this.lastShot > 1000) {
      fire(angle);
      this.lastShot = now;
    }
  }
}
