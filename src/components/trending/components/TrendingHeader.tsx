import { motion } from "framer-motion";
import { TrendingUp, Star } from "lucide-react";

export const TrendingHeader = () => {
  return (
    <div className="flex items-center justify-center gap-3 mb-12">
      <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
      <h2 className="text-3xl font-display font-bold gradient-text text-center">
        AI-Analyzed Trending Coins
      </h2>
      <Star className="w-6 h-6 text-primary animate-pulse" />
    </div>
  );
};