import { HealthComponent } from "../components/HealthComponent";
import { PhysicsBodyComponent } from "../components/PhysicsBodyComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { EntityManager } from "../ecs/EntityManager";
import { Graphics } from "pixi.js";
import { createTankBody } from "../physics/createTankBody";
import { TurretComponent } from "../components/TurretComponent";
import { HealthBarRendererComponent } from "../components/HealthBarRendererComponent";
import { Viewport } from "pixi-viewport";
import { attachEntityToBody } from "../utils/bodyEntityMap";
import { CollisionComponent } from "../components/CollisionComponent";
import { AIControllerComponent } from "../components/AIControllerComponent";

export function spawnTank({
  em,
  id,
  viewport,
  x,
  y,
  options,
  teamId,
  isAI,
}: {
  id: string;
  em: EntityManager;
  viewport: Viewport;
  x: number;
  y: number;
  options?: { health?: number; color?: number };
  teamId?: string;
  isAI?: boolean;
}) {
  const tank = em.createEntity(id);

  // PIXI graphics for rendering
  const graphic = new Graphics()
    .circle(0, 0, 20)
    .fill(options?.color ?? 0x00ff00);
  graphic.zIndex = 1000;

  // Matter body
  const body = createTankBody(x, y, 20);

  attachEntityToBody(body, tank);

  tank.addComponent("Health", new HealthComponent(options?.health ?? 100));
  tank.addComponent("HealthBar", new HealthBarRendererComponent(viewport));
  tank.addComponent("Sprite", new SpriteComponent(graphic));
  tank.addComponent("PhysicsBody", new PhysicsBodyComponent(body));
  tank.addComponent(
    "Turret",
    new TurretComponent(
      [
        { offset: [10, -10], angleOffset: -0.1 },
        { offset: [10, 0] },
        { offset: [10, 10], angleOffset: 0.1 },
      ],
      viewport
    )
  );
  tank.addComponent(
    "Collision",
    new CollisionComponent({
      group: "tank",
      teamId,
    })
  );
  if (isAI) tank.addComponent("AIController", new AIControllerComponent());

  return tank;
}
