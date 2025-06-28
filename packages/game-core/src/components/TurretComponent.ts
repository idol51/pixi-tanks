import { Graphics, Container, Point } from "pixi.js";
import { Component } from "../ecs/Component";
import { Vector } from "matter-js";
import { Barrel } from "./Barrel";

export class TurretComponent implements Component {
  container: Container;
  turret: Graphics;
  barrels: Barrel[] = [];

  constructor(
    public layout: { offset: [number, number]; angleOffset?: number }[]
  ) {
    this.container = new Container();
    for (const b of layout) {
      const barrel = new Barrel(new Point(...b.offset), b.angleOffset ?? 0);
      this.barrels.push(barrel);
    }
    this.turret = new Graphics().rect(0, -4, 30, 8).fill(0xcccccc);
    this.container.addChild(this.turret);
  }

  setRotation(angle: number) {
    this.container.rotation = angle;
  }

  setPosition(vector: Vector) {
    this.container.position.set(vector.x, vector.y);
  }

  getView() {
    return this.container;
  }

  getBarrels(): Barrel[] {
    return this.barrels;
  }
}
