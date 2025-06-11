export interface IBullet {
  id: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  update(delta: number): void;
  isAlive(): boolean;
}
