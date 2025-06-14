// packages/game-core/factories/TankFactory.ts
import { v4 as uuid } from "uuid";
import { TANK_STATS } from "../data/tank-stats";
import { BaseTank } from "../entities/Tank/base-tank";
import { MissileLauncherTank } from "../entities/Tank/types/offensive/MissileLauncherTank";
import { BotTank } from "../entities/Tank/types/basic/BotTank";

export enum TankVariant {
  BOT_TANK = "botTank",
  MISSILE_LAUNCHER = "missileLauncher",
}

export class TankFactory {
  static createTank(variant: TankVariant, name: string, id = uuid()): BaseTank {
    const stats = TANK_STATS[variant];

    switch (variant) {
      case TankVariant.BOT_TANK:
        return new BotTank(id, name, stats);

      case TankVariant.MISSILE_LAUNCHER:
        return new MissileLauncherTank(id, name, stats);

      // Add other variants here...

      default:
        throw new Error(`Unknown tank variant: ${variant}`);
    }
  }
}
