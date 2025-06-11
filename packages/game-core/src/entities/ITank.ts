export interface ITank {
  id: string;
  name: string;
  velocity: { x: number; y: number };
  health: number;
  maxHealth: number;
  score: number;

  update(delta: number): void;
  move(direction: { x: number; y: number }): void;
  rotate(angle: number): void;
  takeDamage(amount: number): void;
  isAlive(): boolean;
}
