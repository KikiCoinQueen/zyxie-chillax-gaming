import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightLeft, Sparkles, AlertTriangle, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArbitrageOpportunityCard } from "./components/ArbitrageOpportunityCard";
import { calculateProfitPotential } from "./utils/arbitrageUtils";

interface ArbitrageOpportunity {
  tokenSymbol: string;
  dex1: {
    name: string;
    price: number;
  };
  dex2: {
    name: string;
    price: number;
  };
  profitPercentage: number;
  estimatedProfit: number;
  liquidityScore: number;
  riskLevel: string;
  timestamp: number;
}

export const ArbitrageScanner = () => {
  const [minProfitThreshold, setMinProfitThreshold] = useState(1.5); // 1.5%

  const { data: opportunities, isLoading, refetch } = useQuery({
    queryKey: ["arbitrageOpportunities"],
    queryFn: async () => {
      try {
        // Fetch prices from multiple DEXes
        const [dex1Response, dex2Response] = await Promise.all([
          fetch("https://api.dexscreener.com/latest/dex/tokens/SOL"),
          fetch("https://api.dexscreener.com/latest/dex/tokens/SOL,ETH")
        ]);

        const [dex1Data, dex2Data] = await Promise.all([
          dex1Response.json(),
          dex2Response.json()
        ]);

        // Process and compare prices
        const opportunities: ArbitrageOpportunity[] = [];
        const processedPairs = new Set();

        dex1Data.pairs?.forEach((pair1: any) => {
          const matchingPair = dex2Data.pairs?.find(
            (pair2: any) => 
              pair2.baseToken.symbol.toLowerCase() === pair1.baseToken.symbol.toLowerCase() &&
              !processedPairs.has(pair1.baseToken.symbol.toLowerCase())
          );

          if (matchingPair) {
            const price1 = parseFloat(pair1.priceUsd);
            const price2 = parseFloat(matchingPair.priceUsd);
            
            if (!isNaN(price1) && !isNaN(price2)) {
              const profitPotential = calculateProfitPotential(price1, price2);
              
              if (profitPotential.percentage > minProfitThreshold) {
                processedPairs.add(pair1.baseToken.symbol.toLowerCase());
                
                opportunities.push({
                  tokenSymbol: pair1.baseToken.symbol,
                  dex1: {
                    name: pair1.dexId,
                    price: price1
                  },
                  dex2: {
                    name: matchingPair.dexId,
                    price: price2
                  },
                  profitPercentage: profitPotential.percentage,
                  estimatedProfit: profitPotential.estimatedProfit,
                  liquidityScore: Math.min(
                    parseFloat(pair1.liquidity?.usd || "0"),
                    parseFloat(matchingPair.liquidity?.usd || "0")
                  ) / 1000000, // Score based on millions in liquidity
                  riskLevel: profitPotential.percentage > 5 ? "High" : "Medium",
                  timestamp: Date.now()
                });
              }
            }
          }
        });

        return opportunities.sort((a, b) => b.profitPercentage - a.profitPercentage);
      } catch (error) {
        console.error("Error fetching arbitrage opportunities:", error);
        toast.error("Failed to fetch arbitrage data");
        return [];
      }
    },
    refetchInterval: 30000,
    meta: {
      onError: () => {
        toast.error("Failed to fetch arbitrage opportunities");
      }
    }
  });

  return (
    <section className="py-20 px-4" id="arbitrage-scanner">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <ArrowRightLeft className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Real-Time Arbitrage Scanner
            </h2>
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Live Opportunities</span>
                  {isLoading && (
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : !opportunities?.length ? (
                <div className="text-center py-10">
                  <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    No profitable opportunities found at the moment
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Keep checking back for new opportunities!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {opportunities.map((opportunity) => (
                    <ArbitrageOpportunityCard
                      key={`${opportunity.tokenSymbol}-${opportunity.timestamp}`}
                      opportunity={opportunity}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>Data updates every 30 seconds • Not financial advice • DYOR</p>
            <p className="mt-1">
              Showing opportunities with &gt;{minProfitThreshold}% potential profit
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};