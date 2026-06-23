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
      onMove(data.vector);
    });

    joystick.on("end", () => {
      onMove({ x: 0, y: 0 });
    });

    return () => joystick.destroy();
  }, []);

  return (
    <div
      ref={divRef}
      style={{ ...position }}
      className="absolute z-[60] w-32 h-32"
    />
  );
}
