import { TankStats } from "../../../../data/tank-stats";
import { BulletType } from "../../../../factories/BulletFactory";
import { MissileTurret } from "../../../Turret/MissileTurret";
import { BaseTank, TankType } from "../../base-tank";

export class MissileLauncherTank extends BaseTank {
  constructor(
    id: string,
    name: string,
    type: TankType = "ai",
    stats: TankStats
  ) {
    super(id, name, type, stats);
    this.turret = new MissileTurret(0x4444aa, 500, BulletType.MISSILE);
    this.addChild(this.turret);
  }
}
