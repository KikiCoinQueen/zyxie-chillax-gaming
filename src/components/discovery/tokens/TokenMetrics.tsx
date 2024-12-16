import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface TokenMetricsProps {
  symbol: string;
  name: string;
  riskLevel: number;
  potentialScore: number;
  communityScore: number;
  price: number;
  volume24h: number;
  marketCap: number;
}

export const TokenMetrics = ({
  symbol,
  name,
  riskLevel,
  potentialScore,
  communityScore,
  price,
  volume24h,
  marketCap
}: TokenMetricsProps) => {
  const getRiskColor = (risk: number): string => {
    if (risk >= 4) return "text-red-500";
    if (risk >= 3) return "text-yellow-500";
    return "text-green-500";
  };

  const getPotentialBadge = (score: number) => {
    if (score >= 4) return "🌟 High Potential";
    if (score >= 3) return "⭐ Promising";
    return "💫 Speculative";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          {symbol}
          <span className="text-sm text-muted-foreground ml-2">
            {name}
          </span>
        </div>
        <Badge>
          {getPotentialBadge(potentialScore)}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span>Risk Level</span>
          <span className={`font-mono ${getRiskColor(riskLevel)}`}>
            {riskLevel.toFixed(1)}/5
          </span>
        </div>
        <Progress value={riskLevel * 20} className="h-1.5" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span>Growth Potential</span>
          <span className="font-mono">
            {potentialScore.toFixed(1)}/5
          </span>
        </div>
        <Progress value={potentialScore * 20} className="h-1.5" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span>Community Score</span>
          <span className="font-mono">
            {communityScore.toFixed(1)}/5
          </span>
        </div>
        <Progress value={communityScore * 20} className="h-1.5" />
      </div>

      <div className="pt-4 border-t border-border/50">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Price</p>
            <p className="font-mono">
              ${price.toFixed(6)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Volume 24h</p>
            <p className="font-mono">
              ${volume24h.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};