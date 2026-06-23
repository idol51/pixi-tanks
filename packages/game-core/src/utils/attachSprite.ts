import { Viewport } from "pixi-viewport";
import { Graphics } from "pixi.js";
import { SpriteComponent } from "../components/SpriteComponent";

export function attachSpriteToViewport(
  viewport: Viewport,
  spriteComponent: SpriteComponent
) {
  if (!spriteComponent.attached) {
    viewport.addChild(spriteComponent.sprite);
    spriteComponent.attached = true;
  }
}

export function createAndAttachSprite(
  viewport: Viewport,
  draw: (g: Graphics) => Graphics,
  zIndex = 100
): SpriteComponent {
  const graphic = draw(new Graphics());
  graphic.zIndex = zIndex;
  const component = new SpriteComponent(graphic);
  attachSpriteToViewport(viewport, component);
  return component;
}
