import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Diamond, TrendingUp, Volume2, AlertTriangle } from "lucide-react";
import { EnhancedTrendingCoin } from "@/types/coin";

interface TrendingGridProps {
  coins: EnhancedTrendingCoin[];
  selectedCoin: string | null;
  onCoinSelect: (id: string) => void;
  isLoading: boolean;
}

export const TrendingGrid = ({ coins, selectedCoin, onCoinSelect, isLoading }: TrendingGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!coins?.length) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No trending coins found at the moment.</p>
        <p className="text-sm mt-2">Check back soon for new opportunities!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {coins.map((coin, index) => (
        <motion.div 
          key={coin.item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative"
        >
          <Card 
            className={`
              glass-card hover:scale-[1.02] transition-all cursor-pointer
              ${selectedCoin === coin.item.id ? 'ring-2 ring-primary' : ''}
            `}
            onClick={() => onCoinSelect(coin.item.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {coin.item.thumb && (
                    <img 
                      src={coin.item.thumb} 
                      alt={coin.item.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="text-lg">{coin.item.symbol.toUpperCase()}</span>
                    <span className="text-xs text-muted-foreground">{coin.item.name}</span>
                  </div>
                </div>
                <Badge 
                  variant={coin.analysis.gemScore >= 60 ? "default" : "secondary"}
                  className="ml-2"
                >
                  {coin.analysis.gemClassification}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Diamond className="w-4 h-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Gem Score</span>
                    <span className="font-mono">{coin.analysis.gemScore.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">24h Change</span>
                    <span className={`font-mono ${
                      coin.item.data.price_change_percentage_24h >= 0 
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }`}>
                      {coin.item.data.price_change_percentage_24h?.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Market Cap</span>
                  <span className="font-mono">{coin.analysis.keyMetrics.marketCap}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Volume 24h</span>
                  <span className="font-mono">{coin.analysis.keyMetrics.volume24h}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vol/MCap Ratio</span>
                  <span className="font-mono">{coin.analysis.keyMetrics.volumeToMcap}</span>
                </div>
              </div>

              {coin.analysis.potentialCatalysts.length > 0 && (
                <div className="pt-2 border-t border-border/50">
                  <div className="flex flex-wrap gap-2">
                    {coin.analysis.potentialCatalysts.map((catalyst, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {catalyst}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {coin.analysis.riskLevel === "Very High" && (
                <div className="flex items-center gap-2 text-yellow-500 text-sm mt-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>High Risk - DYOR</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};