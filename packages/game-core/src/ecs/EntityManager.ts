import { ComponentMap } from "./ComponentMap";
import { Entity } from "./Entity";

export class EntityManager {
  private entities: Map<string, Entity> = new Map();

  createEntity(id: string): Entity {
    const entity = new Entity(id);
    this.entities.set(id, entity);
    return entity;
  }

  getEntity(id: string): Entity | undefined {
    return this.entities.get(id);
  }

  removeEntity(id: string): void {
    this.entities.delete(id);
  }

  getAllEntities(): Entity[] {
    return Array.from(this.entities.values());
  }

  queryByComponents<T extends (keyof ComponentMap)[]>(
    ...componentTypes: T
  ): Entity[] {
    return this.getAllEntities().filter((entity) =>
      componentTypes.every((type) => entity.hasComponent(type))
    );
  }
}
