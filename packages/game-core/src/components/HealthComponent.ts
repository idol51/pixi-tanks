// components/HealthComponent.ts
export class HealthComponent {
  current: number;
  max: number;
  lastAttackerId: string | null = null;
  lastDamagedAt = 0;
  regenRate = 0;

  constructor(max: number, regenRate = 0) {
    this.max = max;
    this.current = max;
    this.regenRate = regenRate;
  }

  takeDamage(amount: number, attackerId?: string) {
    this.current = Math.max(0, this.current - amount);
    this.lastDamagedAt = performance.now();
    if (attackerId) this.lastAttackerId = attackerId;
  }

  isDead(): boolean {
    return this.current <= 0;
  }

  heal(amount: number) {
    this.current = Math.min(this.max, this.current + amount);
  }
}
