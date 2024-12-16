import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";

interface AnalysisCardProps {
  symbol: string;
  sentiment: string;
  riskScore: number;
  momentum: number;
  socialScore: number;
  recommendation: string;
  confidence: number;
}

export const AnalysisCard = ({
  symbol,
  sentiment,
  riskScore,
  momentum,
  socialScore,
  recommendation,
  confidence
}: AnalysisCardProps) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {symbol}
          <Badge variant={sentiment === "POSITIVE" ? "default" : "destructive"}>
            {sentiment}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Risk Score</span>
              <span className="font-mono">{riskScore.toFixed(1)}/5</span>
            </div>
            <Progress value={riskScore * 20} className="h-1.5" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Momentum</span>
              <span className="font-mono">{momentum.toFixed(1)}/5</span>
            </div>
            <Progress value={momentum * 20} className="h-1.5" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Social Score</span>
              <span className="font-mono">{socialScore.toFixed(1)}/5</span>
            </div>
            <Progress value={socialScore * 20} className="h-1.5" />
          </div>

          <div className="flex items-start gap-2 pt-4 border-t border-border/50">
            <AlertTriangle className="w-4 h-4 text-primary mt-1" />
            <div>
              <p className="text-sm font-medium">{recommendation}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Confidence: {(confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};