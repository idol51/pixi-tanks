import { EntityManager } from "./EntityManager";

export abstract class System {
  abstract update(em: EntityManager): void;
}
