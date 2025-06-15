import { v4 as uuid } from "uuid";
import { BaseTank } from "../entities/Tank/base-tank";
import { MissileLauncherTank } from "../entities/Tank/types/offensive/MissileLauncherTank";
import { BotTank } from "../entities/Tank/types/basic/BotTank";
import { ShotgunTank } from "../entities/Tank/types/offensive/ShotgunTank";
import { SniperTank } from "../entities/Tank/types/offensive/SniperTank";
import { FillInput } from "pixi.js";

export enum TankVariant {
  BOT = "bot",
  MISSILE_LAUNCHER = "missileLauncher",
  SHOTGUN = "shotgun",
  SNIPER = "sniper",
}

export class TankFactory {
  static createTank(
    variant: TankVariant,
    name: string,
    id = uuid(),
    color: FillInput
  ): BaseTank {
    switch (variant) {
      case TankVariant.BOT:
        return new BotTank(id, name, color);

      case TankVariant.MISSILE_LAUNCHER:
        return new MissileLauncherTank(id, name, color);

      case TankVariant.SHOTGUN:
        return new ShotgunTank(id, name, color);

      case TankVariant.SNIPER:
        return new SniperTank(id, name, color);

      // Add other variants here...

      default:
        throw new Error(`Unknown tank variant: ${variant}`);
    }
  }
}
