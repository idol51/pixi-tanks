import { AIControllerComponent } from "../components/AIControllerComponent";
import { BulletComponent } from "../components/BulletComponent";
import { CollisionComponent } from "../components/CollisionComponent";
import { DamageFlashComponent } from "../components/DamageFlashComponent";
import { HealthBarRendererComponent } from "../components/HealthBarRendererComponent";
import { HealthComponent } from "../components/HealthComponent";
import { InputComponent } from "../components/InputComponent";
import { NameComponent } from "../components/NameComponent";
import { PendingDestroyComponent } from "../components/PendingDestroyComponent";
import { PhysicsBodyComponent } from "../components/PhysicsBodyComponent";
import { ProgressionComponent } from "../components/ProgressionComponent";
import { ScoreValueComponent } from "../components/ScoreValueComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { StatsComponent } from "../components/StatsComponent";
import { TurretComponent } from "../components/TurretComponent";
import { TankClassComponent } from "../components/TankClassComponent";
import { WanderingComponent } from "../components/WanderingComponent";

export interface ComponentMap {
  Health: HealthComponent;
  Sprite: SpriteComponent;
  PhysicsBody: PhysicsBodyComponent;
  Input: InputComponent;
  Turret: TurretComponent;
  TankClass: TankClassComponent;
  HealthBar: HealthBarRendererComponent;
  Collision: CollisionComponent;
  AIController: AIControllerComponent;
  Wandering: WanderingComponent;
  Stats: StatsComponent;
  Bullet: BulletComponent;
  PendingDestroy: PendingDestroyComponent;
  ScoreValue: ScoreValueComponent;
  Progression: ProgressionComponent;
  DamageFlash: DamageFlashComponent;
  Name: NameComponent;
}
