import { Component } from "../ecs/Component";

export class InputComponent implements Component {
  direction = { x: 0, y: 0 };
  mousePosition = { x: 0, y: 0 };
  fire = false;
}
