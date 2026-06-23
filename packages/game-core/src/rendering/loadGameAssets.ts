import { Assets, Graphics, Renderer, Sprite, Texture } from "pixi.js";
import { TANK_CLASS_TREE, TankClassId } from "../data/tank-classes";
import {
  getTankTextureKey,
  getShapeTextureKey,
  getTankAssetUrl,
  getShapeAssetUrl,
} from "./assetManifest";
import { ShapeType } from "../factories/WanderingShapeFactory";

const textureCache = new Map<string, Texture>();
let assetsLoaded = false;

const shapeSides: Record<ShapeType, number> = {
  triangle: 3,
  square: 4,
  pentagon: 5,
  hexagon: 6,
};

const shapeColors: Record<ShapeType, number> = {
  triangle: 0xff4444,
  square: 0xffff44,
  pentagon: 0x4444ff,
  hexagon: 0xde00ff,
};

const shapeSizes: Record<ShapeType, number> = {
  triangle: 12,
  square: 14,
  pentagon: 24,
  hexagon: 48,
};

function drawTankGraphic(classId: TankClassId): Graphics {
  const def = TANK_CLASS_TREE[classId];
  const { radius, color } = def.bodyStyle;
  const g = new Graphics();
  g.circle(0, 0, radius).fill(color);
  g.circle(0, 0, radius * 0.75).stroke({
    width: 2,
    color: 0xffffff,
    alpha: 0.25,
  });
  g.circle(radius * 0.35, -radius * 0.2, radius * 0.12).fill({
    color: 0xffffff,
    alpha: 0.35,
  });
  return g;
}

function drawShapeGraphic(shape: ShapeType): Graphics {
  const sides = shapeSides[shape];
  const r = shapeSizes[shape];
  const g = new Graphics();
  const step = (Math.PI * 2) / sides;
  g.moveTo(r, 0);
  for (let i = 1; i <= sides; i++) {
    g.lineTo(Math.cos(i * step) * r, Math.sin(i * step) * r);
  }
  g.fill(shapeColors[shape]);
  g.stroke({ width: 2, color: 0xffffff, alpha: 0.2 });
  return g;
}

async function tryLoadFileTexture(url: string): Promise<Texture | null> {
  try {
    const texture = await Assets.load<Texture>(url);
    return texture;
  } catch {
    return null;
  }
}

function cacheProceduralTank(renderer: Renderer, classId: TankClassId) {
  const g = drawTankGraphic(classId);
  const texture = renderer.generateTexture(g);
  textureCache.set(getTankTextureKey(classId), texture);
  g.destroy();
}

function cacheProceduralShape(renderer: Renderer, shape: ShapeType) {
  const g = drawShapeGraphic(shape);
  const texture = renderer.generateTexture(g);
  textureCache.set(getShapeTextureKey(shape), texture);
  g.destroy();
}

export async function loadGameAssets(renderer: Renderer): Promise<void> {
  if (assetsLoaded) return;

  for (const classId of Object.keys(TANK_CLASS_TREE) as TankClassId[]) {
    const url = getTankAssetUrl(classId);
    const fileTexture = await tryLoadFileTexture(url);
    if (fileTexture) {
      textureCache.set(getTankTextureKey(classId), fileTexture);
    } else {
      cacheProceduralTank(renderer, classId);
    }
  }

  for (const shape of Object.keys(shapeSides) as ShapeType[]) {
    const url = getShapeAssetUrl(shape);
    const fileTexture = await tryLoadFileTexture(url);
    if (fileTexture) {
      textureCache.set(getShapeTextureKey(shape), fileTexture);
    } else {
      cacheProceduralShape(renderer, shape);
    }
  }

  assetsLoaded = true;
}

export function getTexture(key: string): Texture | undefined {
  return textureCache.get(key);
}

export function hasLoadedAssets(): boolean {
  return assetsLoaded;
}

export function createTankSprite(classId: TankClassId): Sprite | Graphics {
  const key = getTankTextureKey(classId);
  const texture = textureCache.get(key);
  if (texture) {
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);
    return sprite;
  }
  return drawTankGraphic(classId);
}

export function createShapeSprite(shape: ShapeType): Sprite | Graphics {
  const key = getShapeTextureKey(shape);
  const texture = textureCache.get(key);
  if (texture) {
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);
    return sprite;
  }
  return drawShapeGraphic(shape);
}

export function getTankPreviewUrl(classId: TankClassId): string | null {
  const url = getTankAssetUrl(classId);
  if (typeof window !== "undefined") return url;
  const texture = textureCache.get(getTankTextureKey(classId));
  if (!texture) return null;
  const canvas = texture.source?.resource as HTMLCanvasElement | undefined;
  return canvas instanceof HTMLCanvasElement ? canvas.toDataURL("image/png") : null;
}

export function resetGameAssetsForTests() {
  textureCache.clear();
  assetsLoaded = false;
}
