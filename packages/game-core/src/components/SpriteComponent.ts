import { Component } from "../ecs/Component";
import { Graphics } from "pixi.js";

export class SpriteComponent implements Component {
  constructor(public sprite: Graphics) {}
}
