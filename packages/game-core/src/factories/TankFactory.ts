import { HealthComponent } from "../components/HealthComponent";
import { PhysicsBodyComponent } from "../components/PhysicsBodyComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { EntityManager } from "../ecs/EntityManager";
import { Graphics } from "pixi.js";
import { createTankBody } from "../physics/createTankBody";

export function spawnTank(
  id: string,
  em: EntityManager,
  x: number,
  y: number,
  options?: { health?: number; color?: number }
) {
  const tank = em.createEntity(id);

  // PIXI graphics for rendering
  const graphic = new Graphics()
    .circle(0, 0, 20)
    .fill(options?.color ?? 0x00ff00);
  graphic.zIndex = 10;

  // Matter body
  const body = createTankBody(x, y, 20);

  tank.addComponent("Health", new HealthComponent(options?.health ?? 100));
  tank.addComponent("Sprite", new SpriteComponent(graphic));
  tank.addComponent("PhysicsBody", new PhysicsBodyComponent(body));

  return tank;
}
