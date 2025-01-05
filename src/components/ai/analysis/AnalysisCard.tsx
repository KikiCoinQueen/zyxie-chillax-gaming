import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TokenAnalysis } from "./AnalysisUtils";
import { TrendingUp, AlertTriangle, Activity, Users } from "lucide-react";

export const AnalysisCard = ({
  symbol,
  riskScore,
  sentiment,
  recommendation,
  confidence,
  momentum,
  socialScore,
  priceChange,
  volume
}: TokenAnalysis) => {
  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "Strong Buy 🚀":
        return "text-green-500";
      case "Buy 📈":
        return "text-green-400";
      case "Sell 📉":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-muted">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          {symbol}
          <span className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Risk Score</span>
            <span className="font-medium">{riskScore}/10</span>
          </div>
          <Progress value={riskScore * 10} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Activity className="w-4 h-4" />
              Momentum
            </div>
            <div className="font-medium">{momentum.toFixed(1)}%</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              Social Score
            </div>
            <div className="font-medium">{socialScore.toFixed(1)}%</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">AI Confidence</span>
            <span className="text-sm font-medium">{(confidence * 100).toFixed(1)}%</span>
          </div>
          <Progress value={confidence * 100} className="h-2" />
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Recommendation</span>
            <span className={`text-sm font-bold ${getRecommendationColor(recommendation)}`}>
              {recommendation}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};