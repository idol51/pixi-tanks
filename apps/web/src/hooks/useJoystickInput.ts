import { Entity } from "@pixi-tanks/game-core/src/ecs/Entity";
import { RefObject, useEffect } from "react";

export function useJoystickInput(
  tankEntity: Entity,
  joystickRef: RefObject<{ x: number; y: number }>,
  aimRef: RefObject<{ x: number; y: number }>
) {
  useEffect(() => {
    const input = tankEntity.getComponent("Input");
    if (!input) return;

    // Update moveX and moveY from joystickRef.position
    // Update pointerPosition from aimRef.position
    // Update isShooting from fireButton

    const loop = () => {
      input.moveX = joystickRef.current.x;
      input.moveY = joystickRef.current.y;
      input.pointerPosition = {
        x: aimRef.current.x,
        y: aimRef.current.y,
      };
      input.isShooting = aimRef.current.x !== 0 || aimRef.current.y !== 0;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }, []);
}
