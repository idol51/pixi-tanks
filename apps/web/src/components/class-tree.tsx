import {
  GameButton,
  GamePanel,
  GamePanelContent,
  GamePanelHeader,
  GamePanelTitle,
} from "@/components/game-ui";
import { ClassTreeRadial } from "./class-tree-radial";

export function ClassTree({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm">
      <GamePanel
        glow
        className="w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col"
      >
        <GamePanelHeader className="shrink-0 bg-[var(--game-panel)]/95 border-b border-[#00ff00]/20">
          <GamePanelTitle>Tank Class Tree</GamePanelTitle>
          <GameButton variant="secondary" size="sm" onClick={onClose}>
            Close
          </GameButton>
        </GamePanelHeader>
        <GamePanelContent className="overflow-hidden flex flex-col gap-2 py-3">
          <ClassTreeRadial />
          <p className="text-xs text-white/50 text-center font-display tracking-wide shrink-0">
            Hover or tap a tank to inspect. Evolve at levels 15, 30, and 45.
          </p>
        </GamePanelContent>
      </GamePanel>
    </div>
  );
}
