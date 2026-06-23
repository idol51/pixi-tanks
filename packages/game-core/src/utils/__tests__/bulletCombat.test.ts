import { describe, expect, it } from "vitest";
import {
  resolveBulletEntityHit,
  resolveBulletVsBullet,
} from "../bulletCombat";

describe("resolveBulletEntityHit", () => {
  it("destroys bullet on failed penetration with half damage", () => {
    const result = resolveBulletEntityHit(
      { damage: 20, penetration: 5 },
      { armor: 10, bodyDamage: 3 }
    );
    expect(result.damageToTarget).toBe(10);
    expect(result.bulletDestroyed).toBe(true);
  });

  it("lets high-pen bullets survive weak shapes and pierce onward", () => {
    const result = resolveBulletEntityHit(
      { damage: 36, penetration: 35 },
      { armor: 2, bodyDamage: 5 }
    );
    expect(result.damageToTarget).toBe(36);
    expect(result.bulletDestroyed).toBe(false);
    expect(result.bulletDamageAfter).toBe(31);
    expect(result.bulletPenetrationAfter).toBe(33);
  });

  it("destroys bullet when target body damage exceeds bullet damage", () => {
    const result = resolveBulletEntityHit(
      { damage: 7, penetration: 12 },
      { armor: 8, bodyDamage: 12 }
    );
    expect(result.damageToTarget).toBe(7);
    expect(result.bulletDestroyed).toBe(true);
  });
});

describe("resolveBulletVsBullet", () => {
  it("higher penetration bullet wins and loses stats", () => {
    const result = resolveBulletVsBullet(
      { damage: 30, penetration: 40 },
      { damage: 10, penetration: 15 }
    );
    expect(result.bulletBDestroyed).toBe(true);
    expect(result.bulletADestroyed).toBe(false);
    expect(result.bulletADamageAfter).toBe(20);
    expect(result.bulletAPenetrationAfter).toBe(25);
  });

  it("destroys both when penetration is equal", () => {
    const result = resolveBulletVsBullet(
      { damage: 20, penetration: 15 },
      { damage: 18, penetration: 15 }
    );
    expect(result.bulletADestroyed).toBe(true);
    expect(result.bulletBDestroyed).toBe(true);
  });

  it("destroys winner if retaliation depletes pools", () => {
    const result = resolveBulletVsBullet(
      { damage: 12, penetration: 30 },
      { damage: 20, penetration: 10 }
    );
    expect(result.bulletBDestroyed).toBe(true);
    expect(result.bulletADestroyed).toBe(true);
  });
});
