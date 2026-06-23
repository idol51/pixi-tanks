import { Entity, InputState } from "@pixi-tanks/game-core";
import { Viewport } from "pixi-viewport";
import { isMobile } from "pixi.js";

export function applyMobileInput(
  tankEntity: Entity | null,
  movement: { x: number; y: number },
  aim: { x: number; y: number },
  autoFire: boolean
) {
  if (!tankEntity) return;
  const input = tankEntity.getComponent("Input");
  if (!input) return;

  const state: InputState = {
    moveX: movement.x,
    moveY: -movement.y,
    isShooting: autoFire || aim.x !== 0 || aim.y !== 0,
    pointerPosition: {
      x: (window.innerWidth / 2) * (1 + aim.x),
      y: (1 - aim.y) * (window.innerHeight / 2),
    },
  };
  input.updateInput(state);
}

export function applyKeyboardMouseInput(
  tankEntity: Entity | null,
  keys: Set<string>,
  mouse: { x: number; y: number; mouseDown: boolean },
  autoFire: boolean
) {
  if (!tankEntity || isMobile.any) return;
  const input = tankEntity.getComponent("Input");
  if (!input) return;

  const state: InputState = {
    moveY: 0,
    moveX: 0,
    isShooting: false,
    pointerPosition: { x: mouse.x, y: mouse.y },
  };
  if (keys.has("w")) state.moveY = -1;
  if (keys.has("s")) state.moveY = 1;
  if (keys.has("a")) state.moveX = -1;
  if (keys.has("d")) state.moveX = 1;
  if (keys.has(" ") || mouse.mouseDown || autoFire) state.isShooting = true;

  input.updateInput(state);
}

export function createInputListeners(
  _viewport: Viewport,
  onKeysChange: (keys: Set<string>) => void,
  onMouseChange: (mouse: { x: number; y: number; mouseDown: boolean }) => void
) {
  const keys = new Set<string>();
  let mouseDown = false;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  const emitMouse = () => onMouseChange({ x: mouseX, y: mouseY, mouseDown });

  const keyDown = (e: KeyboardEvent) => {
    keys.add(e.key.toLowerCase());
    onKeysChange(new Set(keys));
  };
  const keyUp = (e: KeyboardEvent) => {
    keys.delete(e.key.toLowerCase());
    onKeysChange(new Set(keys));
  };
  const mouseMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    emitMouse();
  };
  const onMouseDown = () => {
    mouseDown = true;
    emitMouse();
  };
  const onMouseUp = () => {
    mouseDown = false;
    emitMouse();
  };

  if (!isMobile.any) {
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
  }

  return () => {
    window.removeEventListener("keydown", keyDown);
    window.removeEventListener("keyup", keyUp);
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mouseup", onMouseUp);
  };
}
