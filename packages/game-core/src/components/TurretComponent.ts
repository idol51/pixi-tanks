import { Graphics, Container, Point } from "pixi.js";

import { Component } from "../ecs/Component";

import { Vector } from "matter-js";

import { Barrel } from "./Barrel";

import { Viewport } from "pixi-viewport";

import { BarrelLayout } from "../data/barrel-layouts";

import { TankClassId } from "../data/tank-classes";

import { drawBarrelGraphic, resolveBarrelVisual } from "../rendering/barrelVisual";



export class TurretComponent implements Component {

  container: Container;

  turret: Graphics[] = [];

  barrels: Barrel[] = [];



  constructor(

    public layout: BarrelLayout,

    public classId: TankClassId,

    viewport: Viewport,

    x?: number,

    y?: number

  ) {

    this.container = new Container();

    this.buildBarrels(layout);

    if (x != null && y != null) {

      this.container.position.set(x, y);

    }

    viewport.addChild(this.container);

  }



  private buildBarrels(layout: BarrelLayout) {

    layout.forEach((b, index) => {

      const barrel = new Barrel(new Point(...b.offset), b.angleOffset ?? 0);

      this.barrels.push(barrel);



      const spec = resolveBarrelVisual(this.classId, index, b);

      const turretSprite = new Graphics();

      drawBarrelGraphic(turretSprite, spec);

      turretSprite.position.set(b.offset[0], b.offset[1]);

      turretSprite.rotation = b.angleOffset ?? 0;

      turretSprite.zIndex = 1000000;

      this.turret.push(turretSprite);

      this.container.addChild(turretSprite);

    });

  }



  rebuild(_viewport: Viewport, layout: BarrelLayout, classId?: TankClassId) {

    for (const sprite of this.turret) {

      this.container.removeChild(sprite);

      sprite.destroy();

    }

    this.turret = [];

    this.barrels = [];

    this.layout = layout;

    if (classId) {

      this.classId = classId;

    }

    this.buildBarrels(layout);

  }



  addBarrel(offset: [number, number], angleOffset = 0) {

    const entry = { offset, angleOffset };

    this.layout = [...this.layout, entry];

    const barrel = new Barrel(new Point(...offset), angleOffset);

    this.barrels.push(barrel);



    const spec = resolveBarrelVisual(

      this.classId,

      this.barrels.length - 1,

      entry

    );

    const turretSprite = new Graphics();

    drawBarrelGraphic(turretSprite, spec);

    turretSprite.position.set(offset[0], offset[1]);

    turretSprite.rotation = angleOffset;

    turretSprite.zIndex = 1000000;

    this.turret.push(turretSprite);

    this.container.addChild(turretSprite);

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

