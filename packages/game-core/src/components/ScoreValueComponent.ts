import { Component } from "../ecs/Component";

export class ScoreValueComponent implements Component {
  constructor(
    public xpValue: number,
    public scoreValue: number = xpValue
  ) {}
}
