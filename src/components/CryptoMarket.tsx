import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MarketHeader } from "./crypto/MarketHeader";
import { MarketGrid } from "./crypto/MarketGrid";
import { MarketFooter } from "./crypto/MarketFooter";
import { MarketError } from "./crypto/MarketError";
import { MarketLoading } from "./crypto/MarketLoading";

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

  return (
    <section className="py-20 px-4" id="market">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MarketHeader />
          
          {isLoading ? (
            <MarketLoading />
          ) : error ? (
            <MarketError onRetry={() => refetch()} />
          ) : (
            <MarketGrid coins={data?.coins || []} onRefresh={() => refetch()} />
          )}

          <MarketFooter />
        </motion.div>
      </div>
    </section>
  );
};