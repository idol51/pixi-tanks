import { Entity, InputState } from "@pixi-tanks/game-core";
import { Viewport } from "pixi-viewport";
import { isMobile } from "pixi.js";
import { useEffect, useState } from "react";

export function useMouseKeyboardInput(
  tankEntity: Entity | null,
  viewport: Viewport | null
) {
  const [keys, setKeys] = useState(() => new Set());
  const [mouseInput, setMouseInput] = useState({
    x: 0,
    y: 0,
    mouseDown: false,
  });

  useEffect(() => {
    if (isMobile.any) return;
    const input = tankEntity?.getComponent("Input");
    if (!input) return;
    const initialInput: InputState = {
      moveY: 0,
      moveX: 0,
      isShooting: false,
      pointerPosition: {
        x: mouseInput.x,
        y: mouseInput.y,
      },
    };
    if (keys.has("w")) initialInput.moveY = -1;
    if (keys.has("s")) initialInput.moveY = 1;
    if (keys.has("a")) initialInput.moveX = -1;
    if (keys.has("d")) initialInput.moveX = 1;
    if (keys.has(" ") || mouseInput.mouseDown) initialInput.isShooting = true;

    input.updateInput(initialInput);
  }, [keys, mouseInput]);

  useEffect(() => {
    if (isMobile.any) return;

    const keyDown = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const newSet = new Set(prev);
        newSet.add(e.key.toLowerCase());
        return newSet;
      });
    };
    const keyUp = (e: KeyboardEvent) => {
      keys.delete(e.key.toLowerCase());
      setKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(e.key.toLowerCase());
        return newSet;
      });
    };

    const mouseMove = (e: MouseEvent) => {
      if (!viewport) return;
      setMouseInput((prev) => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
      }));
    };

    const mouseDown = () => {
      setMouseInput((prev) => ({ ...prev, mouseDown: true }));
    };

    const mouseUp = () => {
      setMouseInput((prev) => ({ ...prev, mouseDown: false }));
    };

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("mousemove", mouseMove);
      window.addEventListener("mousedown", mouseDown);
      window.addEventListener("mouseup", mouseUp);
    };
  }, [viewport]);
}
