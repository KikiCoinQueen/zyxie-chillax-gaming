import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    price_btc: number;
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
          <h2 className="text-3xl font-display font-bold mb-12 gradient-text text-center">
            Trending in Crypto
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.coins?.slice(0, 6).map((coin: TrendingCoin) => (
              <motion.div
                key={coin.item.id}
                whileHover={{ scale: 1.02 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <Card className="border-0 bg-transparent">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <img
                      src={coin.item.thumb}
                      alt={coin.item.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <CardTitle className="text-lg">{coin.item.name}</CardTitle>
                      <CardDescription>{coin.item.symbol.toUpperCase()}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Rank #{coin.item.market_cap_rank}
                      </span>
                      <div className="flex items-center gap-1 text-primary">
                        <span className="font-mono">
                          {coin.item.price_btc.toFixed(8)} BTC
                        </span>
                        {Math.random() > 0.5 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Data provided by CoinGecko API • Updated every minute
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};