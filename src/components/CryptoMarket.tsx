import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Rocket, Star } from "lucide-react";
import { CoinCard } from "./crypto/CoinCard";

interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    price_btc: number;
    data: {
      price_change_percentage_24h?: number;
      market_cap?: number;
      total_volume?: number;
      sentiment_votes_up_percentage?: number;
      community_score?: number;
    };
  };
}

const fetchTrendingCoins = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const CryptoMarket = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trendingCoins'],
    queryFn: fetchTrendingCoins,
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    console.error('Error fetching trending coins:', error);
    return (
      <div className="text-center text-red-500">
        Failed to load trending coins. Please try again later.
      </div>
    );
  }

  return (
    <section className="py-20 px-4" id="market">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Rocket className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Trending Meme Coins
            </h2>
            <Star className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.coins?.slice(0, 6).map((coin: TrendingCoin) => (
              <CoinCard key={coin.item.id} {...coin.item} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Data provided by CoinGecko API • Updated every minute • 
              <span className="text-primary ml-1">More features coming soon!</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};