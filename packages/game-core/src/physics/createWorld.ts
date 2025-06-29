import { Bodies, World as MatterWorld } from "matter-js";
import { Viewport } from "pixi-viewport";
import { world } from "./engine";
import { Grid } from "../entities/Grid";

export function createWorld(viewport: Viewport, width: number, height: number) {
  const thickness = 100;

  const boundaries = [
    Bodies.rectangle(width / 2, -thickness / 2, width, thickness, {
      isStatic: true,
    }), // top
    Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, {
      isStatic: true,
    }), // bottom
    Bodies.rectangle(-thickness / 2, height / 2, thickness, height, {
      isStatic: true,
    }), // left
    Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, {
      isStatic: true,
    }), // right
  ];

  boundaries.forEach((b) => {
    b.label = "boundary";
    MatterWorld.add(world, b);
  });

  const grid = new Grid(width, height);
  viewport.addChild(grid);
}
