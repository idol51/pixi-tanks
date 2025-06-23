import { HealthComponent } from "../components/HealthComponent";
import { InputComponent } from "../components/InputComponent";
import { PhysicsBodyComponent } from "../components/PhysicsBodyComponent";
import { SpriteComponent } from "../components/SpriteComponent";

export interface ComponentMap {
  Health: HealthComponent;
  Sprite: SpriteComponent;
  PhysicsBody: PhysicsBodyComponent;
  Input: InputComponent;
}
