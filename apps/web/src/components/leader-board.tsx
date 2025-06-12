// web/src/components/Leaderboard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useScoreStore } from "@/store/scoreStore";

export const Leaderboard = () => {
  const scores = useScoreStore((s) => s.scores);

  return (
    <Card className="absolute top-4 right-4 w-64 bg-black/80 text-white rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-lg">🏆 Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {scores.map((player, i) => (
            <li key={player.id} className="flex justify-between text-sm">
              <span>
                {i + 1}. {player.name}
              </span>
              <span>{player.score}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
