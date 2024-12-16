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

export const SolanaMemeCoins = () => {
  const [timeframe] = useState("24h");

  const { data: tokens, isLoading, error } = useQuery({
    queryKey: ["solanaMemeCoins", timeframe],
    queryFn: async () => {
      try {
        const response = await fetch(
          "https://api.dexscreener.com/latest/dex/tokens/SOL"
        );
        if (!response.ok) throw new Error("Failed to fetch token data");
        const data = await response.json();
        
        // Ensure data.pairs exists before filtering
        if (!data?.pairs) {
          console.log("No pairs data received:", data);
          return [];
        }
        
        // Filter and sort potential meme coins
        return data.pairs
          .filter((pair: any) => {
            const fdv = parseFloat(pair.fdv);
            const volume = parseFloat(pair.volume24h);
            return fdv && fdv < 10000000 && volume > 1000; // FDV < $10M and 24h volume > $1k
          })
          .sort((a: any, b: any) => {
            return parseFloat(b.volume24h) - parseFloat(a.volume24h);
          })
          .slice(0, 6);
      } catch (error) {
        console.error("Error fetching Solana tokens:", error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    meta: {
      onError: () => {
        toast.error("Failed to fetch Solana meme coins data. Please try again later.");
      }
    }
  });

  if (error) {
    return (
      <div className="text-center text-red-500 py-20">
        <p className="text-lg">Failed to load Solana meme coins.</p>
        <p className="text-sm mt-2">Please try again later or check your connection.</p>
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
              Trending Solana Meme Coins
            </h2>
            <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : tokens?.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p>No trending meme coins found at the moment.</p>
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
                          token.priceChange24h > 0 ? 'text-green-500' : 'text-red-500'
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
              Data provided by DEXScreener • Updated every 30 seconds • 
              <span className="text-primary ml-1">Showing low-cap gems under $10M FDV with active trading</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};