import { Entity } from "../ecs/Entity";
import { v4 as uuid } from "uuid";
import { Bodies, World } from "matter-js";
import { CollisionCategories } from "../components/CollisionComponent";
import { Graphics } from "pixi.js";
import { PhysicsBodyComponent } from "../components/PhysicsBodyComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { WanderingComponent } from "../components/WanderingComponent";
import { HealthComponent } from "../components/HealthComponent";
import { world } from "../physics/engine";
import { EntityManager } from "../ecs/EntityManager";

export type ShapeType = "triangle" | "square" | "pentagon" | "hexagon";

const colorMap: Record<ShapeType, number> = {
  triangle: 0xff4444,
  square: 0xffff44,
  pentagon: 0x4444ff,
  hexagon: 0xde00ff,
};

const sides: Record<ShapeType, number> = {
  triangle: 3,
  square: 4,
  pentagon: 5,
  hexagon: 6,
};

const size: Record<ShapeType, number> = {
  triangle: 12,
  square: 14,
  pentagon: 24,
  hexagon: 48,
};

export function createWanderingShape(
  em: EntityManager,
  shape: ShapeType,
  x: number,
  y: number
): Entity {
  const id = uuid();
  const entity = em.createEntity(id);

  const sprite = new Graphics();

  const angleStep = (Math.PI * 2) / sides[shape];
  sprite.moveTo(size[shape], 0);
  for (let i = 1; i <= sides[shape]; i++) {
    sprite.lineTo(
      Math.cos(i * angleStep) * size[shape],
      Math.sin(i * angleStep) * size[shape]
    );
  }
  sprite.fill(colorMap[shape]);

  const body = Bodies.polygon(x, y, sides[shape], size[shape], {
    restitution: 0.9,
    frictionAir: 0.05,
    collisionFilter: {
      category: CollisionCategories.WANDERING,
      mask: CollisionCategories.TANK | CollisionCategories.BULLET,
    },
  });

  World.add(world, body);

  entity.addComponent("PhysicsBody", new PhysicsBodyComponent(body));
  entity.addComponent("Sprite", new SpriteComponent(sprite));
  entity.addComponent("Wandering", new WanderingComponent());
  entity.addComponent("Health", new HealthComponent(20)); // optional
  //  entity.addComponent(new ScoreValueComponent(10));

  return entity;
}
