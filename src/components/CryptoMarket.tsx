import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Rocket, Star, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const formatPercentage = (value: number | undefined | null): string => {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'N/A';
    }
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

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
              <motion.div
                key={coin.item.id}
                whileHover={{ scale: 1.02 }}
                className="glass-card rounded-xl overflow-hidden relative group"
              >
                <Card className="border-0 bg-transparent h-full">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="relative">
                      <img
                        src={coin.item.thumb}
                        alt={coin.item.name}
                        className="w-12 h-12 rounded-full ring-2 ring-primary/20"
                      />
                      <Badge 
                        className="absolute -top-2 -right-2 bg-primary/20 backdrop-blur-sm"
                        variant="secondary"
                      >
                        #{coin.item.market_cap_rank || 'N/A'}
                      </Badge>
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        <span className="mr-2">{coin.item.name}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-0 hover:bg-transparent"
                                onClick={() => window.open(`https://www.coingecko.com/en/coins/${coin.item.id}`, '_blank')}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View on CoinGecko</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {coin.item.symbol.toUpperCase()}
                        <span className="px-2 py-0.5 text-xs bg-muted rounded-full">
                          Meme Coin
                        </span>
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Price (BTC)</span>
                        <div className="flex items-center gap-1 text-primary font-mono">
                          <span>{coin.item.price_btc.toFixed(8)}</span>
                          {coin.item.data?.price_change_percentage_24h ? (
                            coin.item.data.price_change_percentage_24h > 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500" />
                            )
                          ) : null}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">24h Change</p>
                          <p className={`font-mono text-sm ${
                            coin.item.data?.price_change_percentage_24h && 
                            coin.item.data.price_change_percentage_24h > 0 
                              ? 'text-green-500' 
                              : 'text-red-500'
                          }`}>
                            {formatPercentage(coin.item.data?.price_change_percentage_24h)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
                          <p className="font-mono text-sm">
                            ${coin.item.data?.market_cap 
                              ? (coin.item.data.market_cap / 1000000).toFixed(2) + 'M'
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
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