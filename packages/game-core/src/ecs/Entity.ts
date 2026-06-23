import { Component } from "./Component";
import { ComponentMap } from "./ComponentMap";

export class Entity {
  id: string;
  private components = new Map<keyof ComponentMap, Component>();

  constructor(id: string) {
    this.id = id;
  }

  addComponent<T extends keyof ComponentMap>(
    type: T,
    component: ComponentMap[T]
  ) {
    this.components.set(type, component);
  }

  getComponent<T extends keyof ComponentMap>(
    type: T
  ): ComponentMap[T] | undefined {
    return this.components.get(type) as ComponentMap[T] | undefined;
  }

  hasComponent<T extends keyof ComponentMap>(type: T): boolean {
    return this.components.has(type);
  }

  removeComponent<T extends keyof ComponentMap>(type: T) {
    this.components.delete(type);
  }

  getAllComponents(): Component[] {
    return Array.from(this.components.values());
  }
}
