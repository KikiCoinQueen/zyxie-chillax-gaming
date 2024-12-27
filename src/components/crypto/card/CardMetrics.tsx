import { TrendingUp, TrendingDown, Volume2, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatPercentage, formatMarketCap, getSentimentColor, getCommunityScore } from "@/utils/formatters";

interface CardMetricsProps {
  price_btc: number;
  data: {
    price_change_percentage_24h?: number;
    total_volume?: number;
    community_score?: number;
  };
}

export const CardMetrics = ({ price_btc, data }: CardMetricsProps) => {
  const hasError = !price_btc || price_btc < 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Price (BTC)</span>
        <div className="flex items-center gap-1 text-primary font-mono">
          {hasError ? (
            <span className="text-destructive">Error</span>
          ) : (
            <>
              <span>{price_btc.toFixed(8)}</span>
              {data?.price_change_percentage_24h ? (
                data.price_change_percentage_24h > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )
              ) : null}
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <Volume2 className="w-4 h-4" />
            Volume 24h
          </span>
          <span className="font-mono">
            {formatMarketCap(data?.total_volume)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            Community Score
          </span>
          <span className={`font-medium ${getSentimentColor(data?.community_score)}`}>
            {getCommunityScore(data?.community_score)}
          </span>
        </div>
      </div>
    </div>
  );
};