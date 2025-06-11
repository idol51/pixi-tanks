import { Graphics } from "pixi.js";

export class Grid extends Graphics {
  constructor(width: number, height: number, spacing = 50, color = 0x333333) {
    super();
    this.drawGrid(width, height, spacing, color);
  }

  private drawGrid(
    width: number,
    height: number,
    spacing: number,
    color: number
  ) {
    this.clear();

    // Vertical lines
    for (let x = 0; x <= width; x += spacing) {
      this.moveTo(x, 0);
      this.lineTo(x, height).stroke({ width: 1, color });
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += spacing) {
      this.moveTo(0, y);
      this.lineTo(width, y).stroke({ width: 1, color });
    }
  }
}
