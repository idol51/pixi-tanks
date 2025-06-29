import { Graphics, Container, Point } from "pixi.js";
import { Component } from "../ecs/Component";
import { Vector } from "matter-js";
import { Barrel } from "./Barrel";
import { Viewport } from "pixi-viewport";

export class TurretComponent implements Component {
  container: Container;
  turret: Graphics;
  barrels: Barrel[] = [];

  constructor(
    public layout: { offset: [number, number]; angleOffset?: number }[],
    viewport: Viewport
  ) {
    this.container = new Container();
    for (const b of layout) {
      const barrel = new Barrel(new Point(...b.offset), b.angleOffset ?? 0);
      this.barrels.push(barrel);
    }
    const turretSprite = new Graphics().rect(0, -4, 30, 8).fill(0xcccccc);
    turretSprite.zIndex = 1;

    this.turret = turretSprite;
    this.container.addChild(this.turret);
    viewport.addChild(this.container);
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
