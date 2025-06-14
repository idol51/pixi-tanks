import { TankStats } from "../../../../data/tank-stats";
import { BulletType } from "../../../../factories/BulletFactory";
import { Turret } from "../../../Turret/Turret";
import { BaseTank } from "../../base-tank";

export class BotTank extends BaseTank {
  constructor(id: string, name: string, stats: TankStats) {
    super(id, name, stats);
    this.turret = new Turret(0x4444aa, 500, BulletType.BULLET);
    this.addChild(this.turret);
  }
}
