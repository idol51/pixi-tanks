import { Component } from "../ecs/Component";
import { Body } from "matter-js";
import { Entity } from "../ecs/Entity";
import { attachEntityToBody } from "../utils/bodyEntityMap";

export class PhysicsBodyComponent implements Component {
  constructor(
    public body: Body,
    entity?: Entity
  ) {
    if (entity) {
      attachEntityToBody(body, entity);
    }
  }
}
