import { Viewport } from "pixi-viewport";
import { Vector } from "matter-js";
import { getClassDef, TankClassId } from "../data/tank-classes";
import { SpriteComponent } from "../components/SpriteComponent";
import { createTankSprite } from "./loadGameAssets";
import { attachSpriteToViewport } from "../utils/attachSprite";

function placeVisual(
  visual: { position: { set: (x: number, y: number) => void } },
  x?: number,
  y?: number
) {
  if (x != null && y != null) {
    visual.position.set(x, y);
  }
}

export function createTankVisual(
  classId: TankClassId,
  viewport: Viewport,
  zIndex = 1000,
  x?: number,
  y?: number
): SpriteComponent {
  const visual = createTankSprite(classId);
  visual.zIndex = zIndex;
  placeVisual(visual, x, y);
  const component = new SpriteComponent(visual);
  component.baseTint = getClassDef(classId).bodyStyle.color;
  attachSpriteToViewport(viewport, component);
  return component;
}

export function updateTankVisual(
  spriteComponent: SpriteComponent,
  classId: TankClassId,
  viewport: Viewport,
  position?: Vector
) {
  const old = spriteComponent.sprite;
  const wasAttached = spriteComponent.attached;

  if (wasAttached) {
    viewport.removeChild(old);
  }
  old.destroy();

  const visual = createTankSprite(classId);
  visual.zIndex = 1000;
  if (position) {
    placeVisual(visual, position.x, position.y);
  }
  spriteComponent.sprite = visual;
  spriteComponent.attached = false;
  attachSpriteToViewport(viewport, spriteComponent);
}
