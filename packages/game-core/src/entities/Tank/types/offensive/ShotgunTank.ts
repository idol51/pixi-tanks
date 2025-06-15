// entities/Tank/types/offensive/ShotgunTank.ts

import { TANK_STATS } from "../../../../data/tank-stats";
import { ShotgunTurret } from "../../../Turret/ShotgunTurret";
import { BaseTank } from "../../base-tank";
import { FillInput } from "pixi.js";

export class ShotgunTank extends BaseTank {
  constructor(id: string, name: string, color: FillInput) {
    super(id, name, color, TANK_STATS.shotgun);
    this.turret = new ShotgunTurret();
    this.addChild(this.turret);
  }
}
