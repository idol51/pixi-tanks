import { create } from "zustand";

type PlayerScore = {
  id: string;
  name: string;
  score: number;
};

type ScoreStore = {
  scores: PlayerScore[];
  updateScore: (id: string, score: number) => void;
  setScores: (scores: PlayerScore[]) => void;
};

export const useScoreStore = create<ScoreStore>((set) => ({
  scores: [],
  updateScore: (id, score) =>
    set((state) => ({
      scores: state.scores.map((p) => (p.id === id ? { ...p, score } : p)),
    })),
  setScores: (scores) => set({ scores }),
}));
