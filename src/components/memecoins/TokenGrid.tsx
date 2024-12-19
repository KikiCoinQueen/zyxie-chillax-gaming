import { motion } from "framer-motion";
import { TokenCard } from "../tokens/TokenCard";
import { TokenData } from "@/types/token";
import { Button } from "@/components/ui/button";

interface TokenGridProps {
  tokens: TokenData[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const TokenGrid = ({ tokens, isLoading, onRefresh }: TokenGridProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="text-lg text-muted-foreground animate-pulse">Discovering latest meme coins...</p>
      </div>
    );
  }

  if (tokens?.length === 0) {
    return (
      <div className="text-center py-16 space-y-6">
        <p className="text-2xl text-muted-foreground">No trending coins found at the moment.</p>
        <p className="text-lg">The market seems quiet. Check back soon for new opportunities!</p>
        <Button 
          onClick={onRefresh} 
          variant="outline"
          className="px-8 py-6 text-lg hover:scale-105 transition-transform"
        >
          Refresh Market Data
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {tokens.map((token: TokenData, index: number) => (
        <motion.div
          key={token.baseToken.address}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <TokenCard token={token} />
        </motion.div>
      ))}
    </motion.div>
  );
};