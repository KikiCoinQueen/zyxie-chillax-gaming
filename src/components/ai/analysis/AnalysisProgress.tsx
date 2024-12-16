import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface AnalysisProgressProps {
  userScore: number;
  selectedTokens: string[];
}

export const AnalysisProgress = ({ userScore, selectedTokens }: AnalysisProgressProps) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Analysis Points</span>
          <span className="font-mono text-xl">{userScore}</span>
        </div>
        <Progress value={(userScore % 100)} className="h-2" />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Achievements</h3>
        <div className="space-y-2">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Analyst Level 1</span>
              <Badge variant="outline">
                {selectedTokens.length}/5 Tokens
              </Badge>
            </div>
            <Progress 
              value={(selectedTokens.length / 5) * 100} 
              className="h-1.5" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};