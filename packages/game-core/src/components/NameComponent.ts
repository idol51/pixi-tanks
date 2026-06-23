import { Component } from "../ecs/Component";

export class NameComponent implements Component {
  constructor(public name: string) {}
}
