import { useEffect, useState } from "react";

export function useMouseAngle(centerRef: React.RefObject<HTMLElement | null>) {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!centerRef.current) return;
      const rect = centerRef.current.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      const dx = e.clientX - center.x;
      const dy = e.clientY - center.y;
      setAngle(Math.atan2(dy, dx));
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [centerRef]);

  return angle;
}
