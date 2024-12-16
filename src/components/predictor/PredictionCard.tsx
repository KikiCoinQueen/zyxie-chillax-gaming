import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatMarketCap, formatPercentage } from "@/utils/formatters";

interface PredictionCardProps {
  token: any;
  onPredict: () => void;
}

export const PredictionCard = ({ token, onPredict }: PredictionCardProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/40 transition-colors">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{token.baseToken.symbol}</span>
          <span className={`text-sm ${
            token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {formatPercentage(token.priceChange24h)}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Vol: {formatMarketCap(parseFloat(token.volume24h))}</span>
          <span>FDV: {formatMarketCap(token.fdv)}</span>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="ml-4"
        onClick={onPredict}
      >
        Predict
      </Button>
    </div>
  );
};