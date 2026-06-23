/** Live bullet combat pools (diep.io-style damage + penetration). */
export type BulletCombatPools = {
  damage: number;
  penetration: number;
};

export type TargetCombatStats = {
  armor: number;
  bodyDamage: number;
};

export type BulletEntityHitResult = {
  damageToTarget: number;
  bulletDamageAfter: number;
  bulletPenetrationAfter: number;
  bulletDestroyed: boolean;
};

export type BulletVsBulletResult = {
  bulletADestroyed: boolean;
  bulletBDestroyed: boolean;
  bulletADamageAfter: number;
  bulletAPenetrationAfter: number;
  bulletBDamageAfter: number;
  bulletBPenetrationAfter: number;
};

/**
 * Resolve bullet hitting a tank or shape.
 * Penetration must meet or exceed target armor for a full hit; otherwise glancing half damage.
 * Target body damage retaliates against the bullet's remaining pools.
 */
export function resolveBulletEntityHit(
  bullet: BulletCombatPools,
  target: TargetCombatStats
): BulletEntityHitResult {
  if (bullet.penetration < target.armor) {
    return {
      damageToTarget: bullet.damage * 0.5,
      bulletDamageAfter: 0,
      bulletPenetrationAfter: 0,
      bulletDestroyed: true,
    };
  }

  const damageToTarget = bullet.damage;
  const bulletDamageAfter = bullet.damage - target.bodyDamage;
  const bulletPenetrationAfter = bullet.penetration - target.armor;

  return {
    damageToTarget,
    bulletDamageAfter,
    bulletPenetrationAfter,
    bulletDestroyed:
      bulletDamageAfter <= 0 || bulletPenetrationAfter <= 0,
  };
}

/**
 * Resolve two bullets colliding. Higher penetration wins; equal penetration destroys both.
 */
export function resolveBulletVsBullet(
  bulletA: BulletCombatPools,
  bulletB: BulletCombatPools
): BulletVsBulletResult {
  if (bulletA.penetration > bulletB.penetration) {
    const bulletADamageAfter = bulletA.damage - bulletB.damage;
    const bulletAPenetrationAfter = bulletA.penetration - bulletB.penetration;
    return {
      bulletADestroyed:
        bulletADamageAfter <= 0 || bulletAPenetrationAfter <= 0,
      bulletBDestroyed: true,
      bulletADamageAfter,
      bulletAPenetrationAfter,
      bulletBDamageAfter: 0,
      bulletBPenetrationAfter: 0,
    };
  }

  if (bulletB.penetration > bulletA.penetration) {
    const bulletBDamageAfter = bulletB.damage - bulletA.damage;
    const bulletBPenetrationAfter = bulletB.penetration - bulletA.penetration;
    return {
      bulletADestroyed: true,
      bulletBDestroyed:
        bulletBDamageAfter <= 0 || bulletBPenetrationAfter <= 0,
      bulletADamageAfter: 0,
      bulletAPenetrationAfter: 0,
      bulletBDamageAfter,
      bulletBPenetrationAfter,
    };
  }

  return {
    bulletADestroyed: true,
    bulletBDestroyed: true,
    bulletADamageAfter: 0,
    bulletAPenetrationAfter: 0,
    bulletBDamageAfter: 0,
    bulletBPenetrationAfter: 0,
  };
}

export function applyBulletPoolResult(
  bullet: BulletCombatPools,
  damageAfter: number,
  penetrationAfter: number
): void {
  bullet.damage = Math.max(0, damageAfter);
  bullet.penetration = Math.max(0, penetrationAfter);
}
