import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CoinListProps {
  holdings: Array<{
    id: string;
    symbol: string;
    amount: number;
    buyPrice: number;
  }>;
  prices: {
    [key: string]: {
      usd: number;
      usd_24h_change: number;
    };
  };
  onRemoveCoin: (id: string) => void;
}

export const CoinList = ({ holdings, prices, onRemoveCoin }: CoinListProps) => (
  <div className="space-y-4">
    {holdings.map(holding => {
      const currentPrice = prices?.[holding.symbol]?.usd || 0;
      const totalValue = holding.amount * currentPrice;
      const totalCost = holding.amount * holding.buyPrice;
      const profit = totalValue - totalCost;
      const profitPercentage = ((totalValue - totalCost) / totalCost) * 100;

      return (
        <motion.div
          key={holding.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="p-4 rounded-lg bg-card/50 border border-border/50"
        >
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold">{holding.symbol.toUpperCase()}</h3>
              <p className="text-sm text-muted-foreground">
                {holding.amount} coins @ ${holding.buyPrice}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-mono">${totalValue.toLocaleString()}</p>
              <div className="flex items-center gap-2">
                {profit >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={profit >= 0 ? "text-green-500" : "text-red-500"}>
                  {profitPercentage.toFixed(2)}%
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveCoin(holding.id)}
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      );
    })}
  </div>
);