import { describe, expect, it } from "vitest";
import { isFriendlyFire } from "../friendlyFire";

describe("isFriendlyFire", () => {
  it("blocks ally vs ally in team mode", () => {
    expect(
      isFriendlyFire(
        { group: "bullet", teamId: "ally" },
        { group: "tank", teamId: "ally" }
      )
    ).toBe(true);
  });

  it("allows FFA player to damage bots without team", () => {
    expect(
      isFriendlyFire(
        { group: "bullet", teamId: "player" },
        { group: "tank", teamId: undefined }
      )
    ).toBe(false);
  });

  it("allows FFA bot to damage player", () => {
    expect(
      isFriendlyFire(
        { group: "bullet", teamId: undefined },
        { group: "tank", teamId: "player" }
      )
    ).toBe(false);
  });

  it("allows player to damage enemy bots", () => {
    expect(
      isFriendlyFire(
        { group: "bullet", teamId: "ally" },
        { group: "tank", teamId: "enemy" }
      )
    ).toBe(false);
  });
});
