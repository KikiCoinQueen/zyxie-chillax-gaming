import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { CoinCard } from "./CoinCard";
import { TrendingCoin } from "@/types/coin";

interface MarketGridProps {
  coins: TrendingCoin[];
  onRefresh: () => void;
}

export const MarketGrid = ({ coins, onRefresh }: MarketGridProps) => {
  if (!coins?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No trending coins found at the moment
        </p>
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          className="mt-4"
        >
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coins.slice(0, 6).map((coin: TrendingCoin) => (
        <CoinCard key={coin.item.id} {...coin.item} />
      ))}
    </div>
  );
};