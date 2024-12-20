import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Flame, TrendingUp, Volume2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ApiDebugPanel } from "../debug/ApiDebugPanel";

interface HotPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  priceChange24h: number;
  volume24h: string;
  createdAt: number;
}

const DEXSCREENER_API = "https://api.dexscreener.com/latest/dex/pairs/solana/";

export const HotPairsScanner = () => {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { data: pairs, isLoading, error } = useQuery({
    queryKey: ["hotPairs"],
    queryFn: async () => {
      const response = await fetch(DEXSCREENER_API);
      if (!response.ok) throw new Error("Failed to fetch pairs");
      const data = await response.json();
      setLastUpdated(new Date());
      return data.pairs;
    },
    select: (pairs) => {
      if (!pairs) return [];
      return pairs
        .filter((pair: HotPair) => {
          const volume = parseFloat(pair.volume24h || '0');
          const age = Date.now() - (pair.createdAt * 1000);
          const isNewEnough = age < 24 * 60 * 60 * 1000; // 24 hours
          return volume > 10000 && isNewEnough; // $10k min volume
        })
        .sort((a: HotPair, b: HotPair) => 
          parseFloat(b.volume24h) - parseFloat(a.volume24h)
        )
        .slice(0, 5);
    },
    refetchInterval: 30000
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="py-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Flame className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-2xl font-bold gradient-text text-center">
              Hot New Pairs
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <Card className="border-red-500/50 bg-red-500/10">
              <CardContent className="pt-6">
                <p className="text-center text-red-400">Failed to load pairs</p>
              </CardContent>
            </Card>
          ) : !pairs?.length ? (
            <Card className="border-yellow-500/50 bg-yellow-500/10">
              <CardContent className="pt-6">
                <p className="text-center text-yellow-400">No hot pairs found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pairs.map((pair: HotPair) => (
                <Card key={pair.pairAddress} className="hover:scale-[1.02] transition-transform">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center gap-2">
                        {pair.baseToken.symbol}
                        <Badge variant="outline" className="text-xs">
                          {pair.dexId}
                        </Badge>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={pair.priceChange24h >= 0 ? "bg-green-500/20" : "bg-red-500/20"}
                      >
                        {pair.priceChange24h >= 0 ? "+" : ""}{pair.priceChange24h?.toFixed(2)}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" /> Price
                        </span>
                        <span className="font-mono">
                          ${parseFloat(pair.priceUsd).toFixed(6)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Volume2 className="w-4 h-4" /> Volume 24h
                        </span>
                        <span className="font-mono">
                          ${parseInt(pair.volume24h).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-4 h-4" /> Listed
                        </span>
                        <span className="font-mono">
                          {new Date(pair.createdAt * 1000).toLocaleString()}
                        </span>
                      </div>
                      <a 
                        href={pair.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-4 text-center text-xs text-primary hover:underline"
                      >
                        View on DexScreener →
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      <section className="py-6 px-4">
        <ApiDebugPanel
          apiUrl={DEXSCREENER_API}
          lastResponse={pairs}
          isLoading={isLoading}
          error={error as Error}
          lastUpdated={lastUpdated}
        />
      </section>
    </div>
  );
};