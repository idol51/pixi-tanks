import { InputState } from "@pixi-tanks/game-core";
import { Entity } from "@pixi-tanks/game-core/src/ecs/Entity";
import { Viewport } from "pixi-viewport";
import { useEffect } from "react";

export function useJoystickInput(
  tankEntity: Entity | null,
  viewport: Viewport | null,
  joystickRef: { x: number; y: number },
  aimRef: { x: number; y: number }
) {
  useEffect(() => {
    if (!tankEntity) return;
    const input = tankEntity.getComponent("Input");
    if (!input) return;

    // Update moveX and moveY from joystickRef.position
    // Update pointerPosition from aimRef.position
    // Update isShooting from fireButton

    const initialInput: InputState = {
      moveY: 0,
      moveX: 0,
      isShooting: false,
      pointerPosition: input.pointerPosition,
    };
    initialInput.moveX = joystickRef.x;
    initialInput.moveY = -joystickRef.y;
    console.log(aimRef, viewport);

    initialInput.pointerPosition.x =
      (window.innerWidth / 2 || 0) * (1 + aimRef.x);
    initialInput.pointerPosition.y =
      (1 - aimRef.y) * (window.innerHeight / 2 || 0);

    initialInput.isShooting = aimRef.x !== 0 || aimRef.y !== 0;

    input.updateInput(initialInput);
  }, [joystickRef, aimRef]);
}
