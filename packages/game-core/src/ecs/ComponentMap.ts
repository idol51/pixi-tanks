import { CollisionComponent } from "../components/CollisionComponent";
import { HealthBarRendererComponent } from "../components/HealthBarRendererComponent";
import { HealthComponent } from "../components/HealthComponent";
import { InputComponent } from "../components/InputComponent";
import { PhysicsBodyComponent } from "../components/PhysicsBodyComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { TurretComponent } from "../components/TurretComponent";

export interface ComponentMap {
  Health: HealthComponent;
  Sprite: SpriteComponent;
  PhysicsBody: PhysicsBodyComponent;
  Input: InputComponent;
  Turret: TurretComponent;
  HealthBar: HealthBarRendererComponent;
  Collision: CollisionComponent;
}
