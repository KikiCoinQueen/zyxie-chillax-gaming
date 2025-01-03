import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { MicroCapCoin } from "../types/microCap";
import { MicroCapCard } from "./MicroCapCard";

interface MicroCapGridProps {
  coins: MicroCapCoin[];
  selectedCoin: string | null;
  onCoinSelect: (id: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export const MicroCapGrid = ({ 
  coins, 
  selectedCoin, 
  onCoinSelect, 
  isLoading,
  error 
}: MicroCapGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-500">Failed to load micro-cap coins</p>
        <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
      </Card>
    );
  }

  if (!coins?.length) {
    return (
      <Card className="p-6 text-center">
        <p className="text-lg">No micro-cap gems found at the moment</p>
        <p className="text-sm text-muted-foreground mt-2">
          Looking for coins under $100M market cap with high potential
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {coins.map((coin, index) => (
        <motion.div
          key={coin.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onClick={() => onCoinSelect(coin.id)}
        >
          <MicroCapCard coin={coin} />
        </motion.div>
      ))}
    </div>
  );
};