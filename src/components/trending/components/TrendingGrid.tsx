import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoinAnalysisCard } from "../CoinAnalysisCard";
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
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card 
            className="glass-card hover:scale-[1.02] transition-transform cursor-pointer"
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
                  <div>
                    <span className="text-lg">{coin.item.symbol.toUpperCase()}</span>
                    <Badge variant="secondary" className="ml-2">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>

          {selectedCoin === coin.item.id && coin.analysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CoinAnalysisCard
                analysis={coin.analysis}
                symbol={coin.item.symbol}
                marketCap={coin.item.data?.market_cap}
                priceChange={coin.item.data?.price_change_percentage_24h}
                rank={index + 1}
              />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};