// components/HealthComponent.ts
export class HealthComponent {
  current: number;
  max: number;

  constructor(max: number) {
    this.max = max;
    this.current = max;
  }

  takeDamage(amount: number) {
    this.current = Math.max(0, this.current - amount);
  }

  isDead(): boolean {
    return this.current <= 0;
  }

  heal(amount: number) {
    this.current = Math.min(this.max, this.current + amount);
  }
}
