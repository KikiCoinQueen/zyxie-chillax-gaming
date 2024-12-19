import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Volume2, DollarSign, ChartLine } from "lucide-react";
import { toast } from "sonner";
import { fetchSolanaTokens } from "@/utils/apiUtils";
import { HeaderSection } from "./memecoins/HeaderSection";
import { StatsCard } from "./memecoins/StatsCard";
import { SortingControls } from "./memecoins/SortingControls";
import { TokenGrid } from "./memecoins/TokenGrid";

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
        <button 
          onClick={() => refetch()}
          className="mt-4 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-background/50 to-background" id="solana-memes">
      <div className="container max-w-6xl mx-auto">
        <HeaderSection useFallback={useFallback} />

        {!isLoading && tokens && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatsCard
              icon={Volume2}
              label="Total Volume"
              value={`$${getTotalVolume().toLocaleString()}`}
              delay={0.2}
            />
            <StatsCard
              icon={DollarSign}
              label="Average Price"
              value={`$${getAveragePrice().toFixed(6)}`}
              delay={0.3}
            />
            <StatsCard
              icon={ChartLine}
              label="Active Pairs"
              value={tokens.length}
              delay={0.4}
            />
          </div>
        )}

        <SortingControls 
          sortBy={sortBy} 
          onSortChange={(value) => setSortBy(value)} 
        />

        <TokenGrid 
          tokens={sortedTokens} 
          isLoading={isLoading} 
          onRefresh={() => refetch()} 
        />

        <div className="mt-12 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {useFallback ? (
              <>Data provided by CoinGecko • Updated every 30 seconds</>
            ) : (
              <>Data provided by DEXScreener • Updated every 30 seconds</>
            )}
          </p>
          <p className="text-xs text-primary">
            Showing low-cap gems under $10M FDV with active trading
          </p>
        </div>
      </div>
    </section>
  );
};