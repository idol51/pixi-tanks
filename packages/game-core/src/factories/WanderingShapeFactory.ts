import { Entity } from "../ecs/Entity";
import { v4 as uuid } from "uuid";
import { Bodies, World } from "matter-js";
import { CollisionCategories } from "../components/CollisionComponent";
import { PhysicsBodyComponent } from "../components/PhysicsBodyComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { WanderingComponent } from "../components/WanderingComponent";
import { HealthComponent } from "../components/HealthComponent";
import { world } from "../physics/engine";
import { EntityManager } from "../ecs/EntityManager";
import { CollisionComponent } from "../components/CollisionComponent";
import { ScoreValueComponent } from "../components/ScoreValueComponent";
import { DamageFlashComponent } from "../components/DamageFlashComponent";
import { Viewport } from "pixi-viewport";
import { attachSpriteToViewport } from "../utils/attachSprite";
import { createShapeSprite } from "../rendering/loadGameAssets";

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

const shapeStats: Record<
  ShapeType,
  { health: number; xp: number; armor: number; bodyDamage: number }
> = {
  triangle: { health: 18, xp: 15, armor: 2, bodyDamage: 5 },
  square: { health: 32, xp: 28, armor: 4, bodyDamage: 8 },
  pentagon: { health: 63, xp: 55, armor: 8, bodyDamage: 12 },
  hexagon: { health: 125, xp: 140, armor: 15, bodyDamage: 20 },
};

export function createWanderingShape(
  em: EntityManager,
  shape: ShapeType,
  x: number,
  y: number,
  viewport?: Viewport
): Entity {
  const id = uuid();
  const entity = em.createEntity(id);
  const stats = shapeStats[shape];

  const spriteGfx = createShapeSprite(shape);
  spriteGfx.zIndex = 500;

  const sprite = new SpriteComponent(spriteGfx);
  sprite.baseTint = colorMap[shape];
  if (viewport) attachSpriteToViewport(viewport, sprite);

  const body = Bodies.polygon(x, y, sides[shape], size[shape], {
    restitution: 0.9,
    frictionAir: 0.05,
    collisionFilter: {
      category: CollisionCategories.WANDERING,
      mask:
        CollisionCategories.TANK |
        CollisionCategories.BULLET |
        CollisionCategories.WALL,
    },
  });

  World.add(world, body);

  entity.addComponent("PhysicsBody", new PhysicsBodyComponent(body, entity));
  entity.addComponent("Sprite", sprite);
  entity.addComponent("Wandering", new WanderingComponent());
  entity.addComponent("Health", new HealthComponent(stats.health));
  entity.addComponent("DamageFlash", new DamageFlashComponent());
  entity.addComponent(
    "ScoreValue",
    new ScoreValueComponent(stats.xp, stats.xp)
  );
  entity.addComponent(
    "Collision",
    new CollisionComponent({
      group: "shape",
      armor: stats.armor,
      bodyDamage: stats.bodyDamage,
    })
  );

  return entity;
}

export { shapeStats, size as shapeSize };
