import { motion } from "framer-motion";
import { Rocket, TrendingUp } from "lucide-react";

interface HeaderSectionProps {
  useFallback: boolean;
}

export const HeaderSection = ({ useFallback }: HeaderSectionProps) => {
  return (
    <div className="text-center space-y-6 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-4"
      >
        <Rocket className="w-10 h-10 text-primary animate-pulse" />
        <h2 className="text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          {useFallback ? "Trending Crypto Coins" : "Solana Meme Gems"}
        </h2>
        <TrendingUp className="w-10 h-10 text-primary animate-pulse" />
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
      >
        Discover the hottest meme coins on Solana with real-time price updates, 
        volume tracking, and market analysis. Make informed decisions with our comprehensive data.
      </motion.p>
    </div>
  );
};