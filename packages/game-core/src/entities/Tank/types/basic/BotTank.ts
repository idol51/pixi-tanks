import { FillInput } from "pixi.js";
import { TANK_STATS } from "../../../../data/tank-stats";
import { Turret } from "../../../Turret/Turret";
import { BaseTank } from "../../base-tank";

export class BotTank extends BaseTank {
  constructor(id: string, name: string, color: FillInput) {
    super(id, name, color, TANK_STATS.bot);
    this.turret = new Turret(this);
    this.addChild(this.turret);
  }
}
