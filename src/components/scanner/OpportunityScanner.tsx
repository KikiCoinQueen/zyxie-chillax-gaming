import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { OpportunityCard } from "./OpportunityCard";
import { calculateOpportunityScore } from "./utils/scoring";
import { TokenOpportunity } from "./types";

export const OpportunityScanner = () => {
  const { data: tokens, isLoading } = useQuery({
    queryKey: ["opportunityScanner"],
    queryFn: async () => {
      try {
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
          throw new Error("Failed to fetch opportunities");
        }
        
        const data = await response.json();
        
        if (!data?.pairs) {
          throw new Error("Invalid data structure");
        }
        
        return data.pairs
          .filter((pair: any) => {
            const fdv = parseFloat(pair.fdv);
            const volume = parseFloat(pair.volume24h);
            return !isNaN(fdv) && !isNaN(volume) && fdv < 5000000 && volume > 1000;
          })
          .map((pair: any) => ({
            baseToken: {
              address: pair.baseToken.address,
              symbol: pair.baseToken.symbol,
            },
            priceChange24h: parseFloat(pair.priceChange24h),
            volume24h: pair.volume24h,
            fdv: parseFloat(pair.fdv),
            opportunityScore: calculateOpportunityScore(
              pair.volume24h,
              parseFloat(pair.priceChange24h),
              parseFloat(pair.fdv)
            )
          }))
          .sort((a: TokenOpportunity, b: TokenOpportunity) => 
            b.opportunityScore.total - a.opportunityScore.total
          )
          .slice(0, 5);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        toast.error("Failed to fetch opportunities");
        return [];
      }
    },
    refetchInterval: 30000
  });

  return (
    <section className="py-20 px-4" id="opportunity-scanner">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Search className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Meme Coin Opportunity Scanner
            </h2>
            <AlertTriangle className="w-6 h-6 text-primary animate-pulse" />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : tokens?.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p>No opportunities found at the moment.</p>
              <p className="text-sm mt-2">Check back soon for new gems!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens?.map((token: TokenOpportunity) => (
                <OpportunityCard key={token.baseToken.address} token={token} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Opportunities updated every 30 seconds • Scores based on volume, price action, and growth potential • 
              <span className="text-primary ml-1">Always DYOR before investing!</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};