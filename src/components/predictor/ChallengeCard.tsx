import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

interface ChallengeCardProps {
  title: string;
  progress: number;
  target: number;
  reward: number;
}

export const ChallengeCard = ({ title, progress, target, reward }: ChallengeCardProps) => {
  const percentage = Math.min((progress / target) * 100, 100);
  const isCompleted = progress >= target;

  return (
    <div className={`p-4 rounded-lg ${
      isCompleted ? 'bg-primary/20' : 'bg-muted/30'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{title}</span>
        <span className="flex items-center gap-1 text-sm">
          <Trophy className="w-4 h-4 text-primary" />
          {reward}
        </span>
      </div>
      
      <Progress value={percentage} className="h-1.5 mb-2" />
      
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>{progress} / {target}</span>
        <span>{isCompleted ? 'Completed!' : `${percentage.toFixed(0)}%`}</span>
      </div>
    </div>
  );
};