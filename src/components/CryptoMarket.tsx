import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Rocket, Star, AlertTriangle } from "lucide-react";
import { CoinCard } from "./crypto/CoinCard";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

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
  console.log("Fetching trending coins...");
  const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log("Trending coins data:", data);
  return data;
};

export const CryptoMarket = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['trendingCoins'],
    queryFn: fetchTrendingCoins,
    refetchInterval: 60000,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching trending coins:', error);
        toast.error("Failed to load trending coins", {
          description: "We'll try again shortly",
          action: {
            label: "Retry",
            onClick: () => refetch()
          }
        });
      }
    }
  });

  if (isLoading) {
    return (
      <section className="py-20 px-4" id="market">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4" id="market">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive animate-pulse" />
            <h3 className="text-xl font-semibold">Failed to Load Trending Coins</h3>
            <p className="text-muted-foreground mb-4">
              We're having trouble fetching the latest market data
            </p>
            <Button 
              onClick={() => refetch()}
              className="animate-pulse"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
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

          {data?.coins?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.coins.slice(0, 6).map((coin: TrendingCoin) => (
                <CoinCard key={coin.item.id} {...coin.item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No trending coins found at the moment
              </p>
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                className="mt-4"
              >
                Refresh
              </Button>
            </div>
          )}

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