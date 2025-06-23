import { Component } from "../ecs/Component";
import { Body } from "matter-js";

export class PhysicsBodyComponent implements Component {
  constructor(public body: Body) {}
}
