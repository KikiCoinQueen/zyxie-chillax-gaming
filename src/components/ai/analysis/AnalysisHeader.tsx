import { Brain, Trophy } from "lucide-react";

export const AnalysisHeader = () => {
  return (
    <div className="flex items-center justify-center gap-3 mb-12">
      <Brain className="w-6 h-6 text-primary animate-pulse" />
      <h2 className="text-3xl font-display font-bold gradient-text text-center">
        AI Meme Coin Analyzer
      </h2>
      <Trophy className="w-6 h-6 text-primary animate-pulse" />
    </div>
  );
};