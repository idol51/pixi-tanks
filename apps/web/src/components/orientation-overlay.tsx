import { useEffect, useState } from "react";
import { RotateCw } from "lucide-react";

export function OrientationOverlay() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  if (!isPortrait) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 text-white flex items-center justify-center text-center p-4">
      <div className="flex flex-col items-center">
        <RotateCw className="h-24 w-24 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Rotate Device</h2>
        <p>Please rotate your device to landscape to play Pixi Tanks.</p>
      </div>
    </div>
  );
}
