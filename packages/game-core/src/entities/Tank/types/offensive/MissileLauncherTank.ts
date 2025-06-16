import { TANK_STATS } from "../../../../data/tank-stats";
import { MissileTurret } from "../../../Turret/MissileTurret";
import { BaseTank } from "../../base-tank";
import { FillInput } from "pixi.js";

export class MissileLauncherTank extends BaseTank {
  constructor(id: string, name: string, color: FillInput) {
    super(id, name, color, TANK_STATS.missileLauncher);
    this.turret = new MissileTurret(this);
    this.addChild(this.turret);
  }
}
