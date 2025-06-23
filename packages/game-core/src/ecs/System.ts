import { EntityManager } from "./EntityManager";

export abstract class System {
  abstract update(delta: number, em: EntityManager): void;
}
