import { useEffect, useRef } from "react";
import nipplejs, { JoystickManagerOptions } from "nipplejs";

export function Joystick({
  position,
  onMove,
}: {
  position: JoystickManagerOptions["position"];
  onMove: (dir: { x: number; y: number }) => void;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!divRef.current) return;

    const joystick = nipplejs.create({
      zone: divRef.current,
      mode: "static",
      position,
      color: "white",
      size: 100,
    });

    joystick.on("move", (_, data) => {
      const rad = data.angle.radian ?? 0;
      onMove({ x: Math.cos(rad), y: Math.sin(rad) });
    });

    joystick.on("end", () => {
      onMove({ x: 0, y: 0 });
    });

    return () => joystick.destroy();
  }, [onMove]);

  return (
    <div
      ref={divRef}
      style={{ ...position }}
      className="absolute z-50 w-32 h-32"
    />
  );
}
