import { useEffect, useState } from "react";

export default function FullscreenOverlay() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const requestFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if ((el as any).webkitRequestFullscreen)
      (el as any).webkitRequestFullscreen();
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("mozfullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    document.addEventListener("msfullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("mozfullscreenchange", onFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        onFullscreenChange
      );
      document.removeEventListener("msfullscreenchange", onFullscreenChange);
    };
  }, []);

  if (isFullscreen) return null;
  return <div className="fixed inset-0 z-50" onClick={requestFullscreen} />;
}
