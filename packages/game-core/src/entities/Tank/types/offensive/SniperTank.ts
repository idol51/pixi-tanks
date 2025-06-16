import { TANK_STATS } from "../../../../data/tank-stats";
import { SniperTurret } from "../../../Turret/SniperTurret";
import { BaseTank } from "../../base-tank";
import { FillInput } from "pixi.js";

export class SniperTank extends BaseTank {
  constructor(id: string, name: string, color: FillInput) {
    super(id, name, color, TANK_STATS.sniper);
    this.turret = new SniperTurret(this);
    this.addChild(this.turret);
  }
}
