import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMarketCap } from "@/utils/formatters";
import { calculateRiskScore } from "./insightUtils";
import { TokenInsight } from "./types";

interface StatsCardsProps {
  insights: TokenInsight[];
}

export const StatsCards = ({ insights }: StatsCardsProps) => {
  const totalVolume = insights?.reduce((total: number, token: TokenInsight) => 
    total + parseFloat(token.volume24h), 0) || 0;

  const positivePerformers = insights?.filter((t: TokenInsight) => t.priceChange24h > 0).length || 0;
  const totalTokens = insights?.length || 0;

  const averageRiskScore = insights && insights.length > 0
    ? (insights.reduce((total: number, token: TokenInsight) => 
        total + calculateRiskScore(token), 0) / insights.length).toFixed(1)
    : "N/A";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Trading Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono">
            {formatMarketCap(totalVolume)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Total 24h volume for listed tokens
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Market Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono">
            {positivePerformers}/{totalTokens}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Tokens with positive 24h performance
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Average Risk Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono">{averageRiskScore}</div>
          <p className="text-sm text-muted-foreground mt-2">
            Based on volume, liquidity, and volatility
          </p>
        </CardContent>
      </Card>
    </div>
  );
};