export * from "./GameWorld";
export * from "./GameEvents";
export * from "./ecs/Entity";
export type { InputState } from "./components/InputComponent";
export type { GameModeId } from "./modes/GameMode";
export type { UpgradeableStat } from "./data/stat-allocation";
export { UPGRADEABLE_STATS, createEmptyAllocations, MAX_STAT_POINTS } from "./data/stat-allocation";
export type { TankClassId } from "./data/tank-classes";
export { getClassDef, getClassName, getEvolutionChoices, TANK_CLASS_TREE } from "./data/tank-classes";
export { loadGameAssets, hasLoadedAssets, getTankPreviewUrl } from "./rendering/loadGameAssets";
export {
  resolveBarrelVisual,
  drawBarrelGraphic,
  barrelColorToHex,
} from "./rendering/barrelVisual";
export type { BarrelVisualSpec, BarrelVisualVariant } from "./rendering/barrelVisual";
export { WORLD_WIDTH, WORLD_HEIGHT } from "./data/world";
export { isFriendlyFire } from "./utils/friendlyFire";
