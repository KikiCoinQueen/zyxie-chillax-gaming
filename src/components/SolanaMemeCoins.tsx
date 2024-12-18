import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Rocket, TrendingUp, Volume2, DollarSign, ChartLineUp } from "lucide-react";
import { toast } from "sonner";
import { TokenCard } from "./tokens/TokenCard";
import { fetchSolanaTokens } from "@/utils/apiUtils";
import { TokenData } from "@/types/token";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SolanaMemeCoins = () => {
  const [useFallback, setUseFallback] = useState(false);
  const [sortBy, setSortBy] = useState<"volume" | "price" | "marketCap">("volume");

  const { data: tokens, isLoading, error, refetch } = useQuery({
    queryKey: ["solanaMemeCoins", useFallback, sortBy],
    queryFn: () => fetchSolanaTokens(useFallback),
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
        if (!useFallback) {
          setUseFallback(true);
        }
      }
    }
  });

  const sortedTokens = tokens ? [...tokens].sort((a, b) => {
    switch (sortBy) {
      case "volume":
        return parseFloat(b.volume24h) - parseFloat(a.volume24h);
      case "price":
        return parseFloat(b.priceUsd) - parseFloat(a.priceUsd);
      case "marketCap":
        return b.fdv - a.fdv;
      default:
        return 0;
    }
  }) : [];

  const getTotalVolume = () => {
    return tokens?.reduce((acc, token) => acc + parseFloat(token.volume24h), 0) || 0;
  };

  const getAveragePrice = () => {
    if (!tokens?.length) return 0;
    const total = tokens.reduce((acc, token) => acc + parseFloat(token.priceUsd), 0);
    return total / tokens.length;
  };

  if (error) {
    return (
      <div className="text-center text-red-500 py-20">
        <p className="text-lg">Failed to load Solana meme coins.</p>
        <Button 
          onClick={() => refetch()}
          className="mt-4 bg-primary hover:bg-primary/90 text-white"
        >
          Try Again
        </Button>
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
          <div className="flex items-center justify-center gap-3 mb-8">
            <Rocket className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              {useFallback ? "Trending Crypto Coins" : "Trending Solana Meme Coins"}
            </h2>
            <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
          </div>

          {!isLoading && tokens && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="glass-card">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Volume</p>
                      <p className="text-xl font-bold">${getTotalVolume().toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Price</p>
                      <p className="text-xl font-bold">${getAveragePrice().toFixed(6)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-2">
                    <ChartLineUp className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Active Pairs</p>
                      <p className="text-xl font-bold">{tokens.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-end mb-6">
            <Select value={sortBy} onValueChange={(value: "volume" | "price" | "marketCap") => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="volume">Sort by Volume</SelectItem>
                <SelectItem value="price">Sort by Price</SelectItem>
                <SelectItem value="marketCap">Sort by Market Cap</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : sortedTokens?.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p>No trending coins found at the moment.</p>
              <p className="text-sm mt-2">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTokens?.map((token: TokenData) => (
                <TokenCard key={token.baseToken.address} token={token} />
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