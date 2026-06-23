export const CollisionCategories = {
  TANK: 0x0001,
  BULLET: 0x0002,
  WALL: 0x0004,
  PICKUP: 0x0008,
  WANDERING: 0x0010,
};

export interface CollisionConfig {
  group: "tank" | "bullet" | "shape" | "obstacle" | "shield";
  ownerId?: string;
  teamId?: string;
  damage?: number;
  armor?: number;
  bodyDamage?: number;
  piercing?: boolean;
  aoeRadius?: number;
  reflect?: boolean;
}

export class CollisionComponent {
  config: CollisionConfig;

  constructor(config: CollisionConfig) {
    this.config = config;
  }
}
