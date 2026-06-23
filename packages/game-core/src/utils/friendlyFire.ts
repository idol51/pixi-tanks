import { CollisionConfig } from "../components/CollisionComponent";

/** Blocks damage only when both tanks share the same explicit ally team. */
export function isFriendlyFire(
  bulletCol: CollisionConfig,
  targetCol: CollisionConfig
): boolean {
  if (bulletCol.group !== "bullet" || targetCol.group !== "tank") {
    return false;
  }

  const shooterTeam = bulletCol.teamId;
  const targetTeam = targetCol.teamId;

  if (!shooterTeam || !targetTeam) return false;

  return shooterTeam === targetTeam && shooterTeam === "ally";
}
