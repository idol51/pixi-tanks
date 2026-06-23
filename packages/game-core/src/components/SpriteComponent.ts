import { Component } from "../ecs/Component";
import { Container } from "pixi.js";

export class SpriteComponent implements Component {
  attached = false;
  baseTint = 0xffffff;

  constructor(public sprite: Container) {}
}
