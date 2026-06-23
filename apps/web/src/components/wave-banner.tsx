import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";

export function WaveBanner() {
  const { waveState, reduceMotion } = useGameStore((s) => ({
    waveState: s.waveState,
    reduceMotion: s.settings.reduceMotion,
  }));

  if (!waveState) return null;

  const { wave, state, countdownMs } = waveState;
  let message = `Wave ${wave}`;
  if (state === "cleared" && countdownMs != null) {
    const secs = Math.ceil(countdownMs / 1000);
    message = `Wave ${wave} cleared — next in ${secs}s`;
  } else if (state === "incoming") {
    message =
      countdownMs != null && countdownMs > 0
        ? `Wave ${wave} incoming in ${Math.ceil(countdownMs / 1000)}s`
        : `Wave ${wave} incoming!`;
  } else if (wave % 5 === 0 && wave >= 5) {
    message = `Wave ${wave} — Boss incoming!`;
  }

  const Wrapper = reduceMotion ? "div" : motion.div;
  const props = reduceMotion
    ? { className: "absolute top-16 left-1/2 -translate-x-1/2 z-30" }
    : {
        className: "absolute top-16 left-1/2 -translate-x-1/2 z-30",
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        key: message,
      };

  return (
    <Wrapper {...props}>
      <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
        {message}
      </div>
    </Wrapper>
  );
}
