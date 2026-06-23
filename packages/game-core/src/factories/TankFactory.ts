import { HealthComponent } from "../components/HealthComponent";
import { PhysicsBodyComponent } from "../components/PhysicsBodyComponent";
import { EntityManager } from "../ecs/EntityManager";
import { createTankBody } from "../physics/createTankBody";
import { TurretComponent } from "../components/TurretComponent";
import { HealthBarRendererComponent } from "../components/HealthBarRendererComponent";
import { Viewport } from "pixi-viewport";
import { CollisionComponent } from "../components/CollisionComponent";
import { AIControllerComponent } from "../components/AIControllerComponent";
import { StatsComponent } from "../components/StatsComponent";
import { ProgressionComponent } from "../components/ProgressionComponent";
import { NameComponent } from "../components/NameComponent";
import { BASE_TANK_STATS } from "../data/tank-stats";
import {
  DEFAULT_BARREL_LAYOUT,
  SHOTGUN_BARREL_LAYOUT,
  BarrelLayout,
} from "../data/barrel-layouts";
import { syncBarrelCooldowns } from "../utils/fireFromTurret";
import { ScoreValueComponent } from "../components/ScoreValueComponent";
import { DamageFlashComponent } from "../components/DamageFlashComponent";
import { TankClassComponent } from "../components/TankClassComponent";
import { getClassDef, TankClassId } from "../data/tank-classes";
import { createTankVisual } from "../rendering/TankVisualFactory";
import { syncVictimScoreValue } from "../utils/scoring";

export type { BarrelLayout };
export { DEFAULT_BARREL_LAYOUT, SHOTGUN_BARREL_LAYOUT };

export function spawnTank({
  em,
  id,
  viewport,
  x,
  y,
  options,
  teamId,
  isAI,
  displayName,
  statsKey = "DEFAULT",
  aiTier = 1,
  barrelLayout,
  tankClassId = "basic",
}: {
  id: string;
  em: EntityManager;
  viewport: Viewport;
  x: number;
  y: number;
  options?: { health?: number; color?: number };
  teamId?: string;
  isAI?: boolean;
  displayName?: string;
  statsKey?: keyof typeof BASE_TANK_STATS;
  aiTier?: number;
  barrelLayout?: BarrelLayout;
  tankClassId?: TankClassId;
}) {
  const tank = em.createEntity(id);
  const classDef = getClassDef(tankClassId);
  const baseStats =
    tankClassId === "basic" && statsKey !== "DEFAULT"
      ? (BASE_TANK_STATS[statsKey] ?? BASE_TANK_STATS.DEFAULT)
      : classDef.stats;
  const color = options?.color ?? baseStats.color;
  const bodyRadius = classDef.bodyStyle.radius;

  const sprite = createTankVisual(tankClassId, viewport, 1000, x, y);
  sprite.baseTint = color;

  const body = createTankBody(x, y, bodyRadius);

  const health = new HealthComponent(
    options?.health ?? baseStats.maxHealth,
    baseStats.healthRegen
  );
  tank.addComponent("Health", health);
  tank.addComponent("HealthBar", new HealthBarRendererComponent(viewport));
  tank.addComponent("Sprite", sprite);
  tank.addComponent("PhysicsBody", new PhysicsBodyComponent(body, tank));

  const layout =
    barrelLayout ??
    classDef.barrelLayout ??
    (statsKey === "SHOTGUN" || statsKey === "BRAWLER"
      ? SHOTGUN_BARREL_LAYOUT
      : DEFAULT_BARREL_LAYOUT);

  tank.addComponent("Turret", new TurretComponent(layout, viewport, x, y));
  tank.addComponent("Stats", new StatsComponent({ ...baseStats, color }));
  tank.addComponent("Progression", new ProgressionComponent());
  tank.addComponent("Name", new NameComponent(displayName ?? id));
  tank.addComponent("DamageFlash", new DamageFlashComponent());
  tank.addComponent("TankClass", new TankClassComponent(tankClassId));
  tank.addComponent(
    "Collision",
    new CollisionComponent({
      group: "tank",
      teamId,
      armor: baseStats.bulletPenetration * 0.5,
      bodyDamage: baseStats.bulletDamage * 0.3,
    })
  );

  syncBarrelCooldowns(tank);

  if (isAI) {
    tank.addComponent("ScoreValue", new ScoreValueComponent(0, 0));
    tank.addComponent(
      "AIController",
      new AIControllerComponent(teamId, { tier: aiTier })
    );
    syncVictimScoreValue(tank);
  }

  return tank;
}
