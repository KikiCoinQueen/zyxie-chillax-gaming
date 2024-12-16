import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Rocket, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { TokenCard } from "./tokens/TokenCard";
import { fetchSolanaTokens } from "@/utils/apiUtils";
import { TokenData } from "@/types/token";

export const SolanaMemeCoins = () => {
  const [useFallback, setUseFallback] = useState(false);

  const { data: tokens, isLoading, error, refetch } = useQuery({
    queryKey: ["solanaMemeCoins", useFallback],
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