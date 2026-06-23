import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";

export function KillFeed({ messages }: { messages: string[] }) {
  const reduceMotion = useGameStore((s) => s.settings.reduceMotion);

  return (
    <div className="absolute bottom-24 left-4 z-10 space-y-1 max-w-xs">
      {messages.map((msg, i) => {
        const Wrapper = reduceMotion ? "div" : motion.div;
        const props = reduceMotion
          ? {}
          : {
              initial: { opacity: 0, x: -12 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.2 },
            };
        return (
          <Wrapper key={`${msg}-${i}`} {...props}>
            <div className="text-xs text-white/90 bg-black/50 pl-3 pr-2 py-1 rounded-sm border border-white/10 border-l-[3px] border-l-[var(--game-accent)] backdrop-blur-sm font-display">
              {msg}
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}
