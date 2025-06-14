// packages/game-core/factories/TankFactory.ts
import { v4 as uuid } from "uuid";
import { TANK_STATS } from "../data/tank-stats";
import { BaseTank, TankType } from "../entities/Tank/base-tank";
import { MissileLauncherTank } from "../entities/Tank/types/offensive/MissileLauncherTank";

export enum TankVariant {
  MISSILE_LAUNCHER = "missileLauncher",
}

export class TankFactory {
  static createTank(
    variant: TankVariant,
    name: string,
    type: TankType = TankType.AI,
    id = uuid()
  ): BaseTank {
    const stats = TANK_STATS[variant];

    switch (variant) {
      case TankVariant.MISSILE_LAUNCHER:
        return new MissileLauncherTank(id, name, type, stats);

      //   case "machineGun":
      //     return new MachineGunTank(id, name, type, stats);

      // Add other variants here...

      default:
        throw new Error(`Unknown tank variant: ${variant}`);
    }
  }
}
