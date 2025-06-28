import { useEffect, useRef } from "react";

export function useMouseControls() {
  const mouseRef = useRef(
    new Map<"x" | "y" | "mousedown", number | boolean>([
      ["x", 0],
      ["y", 0],
      ["mousedown", false],
    ])
  );

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseRef.current.set("x", e.clientX);
      mouseRef.current.set("y", e.clientY);
    };

    const down = () => {
      mouseRef.current.set("mousedown", true);
    };

    const up = () => {
      mouseRef.current.set("mousedown", false);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  return mouseRef.current;
}
