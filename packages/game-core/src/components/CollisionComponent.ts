export const CollisionCategories = {
  TANK: 0x0001,
  BULLET: 0x0002,
  WALL: 0x0004,
  PICKUP: 0x0008,
};

export interface CollisionConfig {
  group: "tank" | "bullet" | "obstacle" | "shield";
  ownerId?: string;
  teamId?: string;
  damage?: number;
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
