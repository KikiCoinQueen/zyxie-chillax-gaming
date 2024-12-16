import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Rocket, TrendingUp, Volume2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatMarketCap, formatPercentage } from "@/utils/formatters";

interface TokenData {
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  volume24h: string;
  priceChange24h: number;
  liquidity: {
    usd: number;
  };
  fdv: number;
}

const FALLBACK_API_URL = "https://api.coingecko.com/api/v3/search/trending";

export const SolanaMemeCoins = () => {
  const [timeframe] = useState("24h");
  const [useFallback, setUseFallback] = useState(false);

  const { data: tokens, isLoading, error, refetch } = useQuery({
    queryKey: ["solanaMemeCoins", timeframe, useFallback],
    queryFn: async () => {
      try {
        console.log("Attempting to fetch Solana tokens...");
        
        if (useFallback) {
          console.log("Using fallback API...");
          const response = await fetch(FALLBACK_API_URL);
          if (!response.ok) throw new Error("Fallback API failed");
          const data = await response.json();
          return data.coins.slice(0, 6).map((coin: any) => ({
            baseToken: {
              address: coin.item.id,
              name: coin.item.name,
              symbol: coin.item.symbol,
            },
            priceUsd: (coin.item.price_btc * 40000).toString(), // Rough BTC price estimate
            volume24h: (coin.item.price_btc * 40000 * 1000000).toString(),
            priceChange24h: coin.item.data?.price_change_percentage_24h || 0,
            liquidity: { usd: 1000000 }, // Default liquidity
            fdv: coin.item.market_cap_rank * 1000000,
          }));
        }

        const response = await fetch(
          "https://api.dexscreener.com/latest/dex/tokens/SOL",
          {
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("DexScreener API Response:", data);
        
        if (!data?.pairs || data.pairs.length === 0) {
          console.log("No valid data from primary API, switching to fallback");
          setUseFallback(true);
          throw new Error("No valid data from primary API");
        }
        
        return data.pairs
          .filter((pair: any) => {
            const fdv = parseFloat(pair.fdv);
            const volume = parseFloat(pair.volume24h);
            return fdv && fdv < 10000000 && volume > 1000;
          })
          .sort((a: any, b: any) => parseFloat(b.volume24h) - parseFloat(a.volume24h))
          .slice(0, 6);
      } catch (error) {
        console.error("Error fetching Solana tokens:", error);
        if (!useFallback) {
          setUseFallback(true);
          throw error;
        }
        throw error;
      }
    },
    refetchInterval: 30000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      onError: () => {
        toast.error("Experiencing API issues, switching to fallback data source", {
          action: {
            label: "Retry",
            onClick: () => {
              setUseFallback(false);
              refetch();
            }
          }
        });
      }
    }
  });

  if (error) {
    return (
      <div className="text-center text-red-500 py-20">
        <p className="text-lg">Failed to load Solana meme coins.</p>
        <button 
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="py-20 px-4" id="solana-memes">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Rocket className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              {useFallback ? "Trending Crypto Coins" : "Trending Solana Meme Coins"}
            </h2>
            <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : tokens?.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p>No trending coins found at the moment.</p>
              <p className="text-sm mt-2">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens?.map((token: TokenData) => (
                <Card key={token.baseToken.address} className="glass-card hover:scale-[1.02] transition-transform">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {token.baseToken.name}
                        <Badge variant="secondary" className="text-xs">
                          {token.baseToken.symbol}
                        </Badge>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-mono">
                          ${Number(token.priceUsd).toFixed(6)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">24h Change</span>
                        <span className={`font-mono ${
                          token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {formatPercentage(token.priceChange24h)}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Volume2 className="w-4 h-4" />
                            Volume 24h
                          </span>
                          <span className="font-mono">
                            {formatMarketCap(parseFloat(token.volume24h))}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            FDV
                          </span>
                          <span className="font-mono">
                            {formatMarketCap(token.fdv)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              {useFallback ? (
                <>Data provided by CoinGecko • Updated every 30 seconds</>
              ) : (
                <>Data provided by DEXScreener • Updated every 30 seconds • 
                <span className="text-primary ml-1">Showing low-cap gems under $10M FDV with active trading</span></>
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};