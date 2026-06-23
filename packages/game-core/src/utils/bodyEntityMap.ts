import { Body } from "matter-js";
import type { Entity } from "../ecs/Entity";

const bodyEntityMap = new WeakMap<Body, Entity>();

export function attachEntityToBody(body: Body, entity: Entity) {
  bodyEntityMap.set(body, entity);
}

export function getEntityFromBody(body: Body): Entity | undefined {
  return bodyEntityMap.get(body);
}
