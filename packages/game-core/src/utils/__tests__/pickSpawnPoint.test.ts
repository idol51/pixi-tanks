import { describe, it, expect } from "vitest";
import { EntityManager } from "../../ecs/EntityManager";
import { PhysicsBodyComponent } from "../../components/PhysicsBodyComponent";
import { Bodies } from "matter-js";
import { pickSpawnPoint } from "../pickSpawnPoint";

describe("pickSpawnPoint", () => {
  it("returns a point in the requested zone", () => {
    const em = new EntityManager();
    const p = pickSpawnPoint(em, "playerStart");
    expect(p.x).toBeGreaterThanOrEqual(200);
    expect(p.y).toBeGreaterThanOrEqual(200);
  });

  it("avoids existing physics bodies within minDist", () => {
    const em = new EntityManager();
    const blocker = em.createEntity("blocker");
    const body = Bodies.circle(300, 300, 20);
    blocker.addComponent("PhysicsBody", new PhysicsBodyComponent(body, blocker));

    const reserved: { x: number; y: number }[] = [];
    for (let i = 0; i < 5; i++) {
      const p = pickSpawnPoint(em, "playerStart", {
        minDist: 100,
        reservedPoints: reserved,
      });
      reserved.push(p);
      const dx = p.x - 300;
      const dy = p.y - 300;
      expect(dx * dx + dy * dy).toBeGreaterThanOrEqual(100 * 100);
    }
  });
});
