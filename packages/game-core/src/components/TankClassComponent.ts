import { Component } from "../ecs/Component";
import { TankClassId } from "../data/tank-classes";

export class TankClassComponent implements Component {
  constructor(public classId: TankClassId = "basic") {}
}
