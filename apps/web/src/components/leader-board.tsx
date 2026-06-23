import {
  GamePanel,
  GamePanelContent,
  GamePanelHeader,
  GamePanelTitle,
} from "@/components/game-ui";
import { useScoreStore } from "@/store/scoreStore";

export const Leaderboard = () => {
  const scores = useScoreStore((s) => s.scores);

  return (
    <GamePanel className="absolute top-4 right-4 w-64 z-10">
      <GamePanelHeader className="pb-0">
        <GamePanelTitle className="text-lg w-full text-center">
          Leaderboard
        </GamePanelTitle>
      </GamePanelHeader>
      <GamePanelContent className="pt-2">
        <ul className="space-y-1">
          {scores.map((player, i) => (
            <li
              key={player.id}
              className={[
                "flex justify-between text-sm font-display tracking-wide px-1 py-0.5 rounded",
                i === 0 ? "text-[var(--game-gold)] bg-[var(--game-gold)]/10" : "text-white/85",
              ].join(" ")}
            >
              <span>
                {i + 1}. {player.name}
              </span>
              <span className="font-mono">{player.score}</span>
            </li>
          ))}
          {scores.length === 0 && (
            <li className="text-xs text-white/40 text-center py-2">No scores yet</li>
          )}
        </ul>
      </GamePanelContent>
    </GamePanel>
  );
};
