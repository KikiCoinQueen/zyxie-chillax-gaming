import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRightLeft, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { formatMarketCap, formatPercentage } from "@/utils/formatters";

interface ArbitrageOpportunity {
  tokenSymbol: string;
  dex1: string;
  dex2: string;
  price1: number;
  price2: number;
  spread: number;
  volume24h: number;
  estimatedProfit: number;
}

const ArbitrageScanner = () => {
  const { data: opportunities, isLoading, refetch } = useQuery({
    queryKey: ["arbitrageOpportunities"],
    queryFn: async () => {
      const response = await fetch("https://api.dexscreener.com/latest/dex/tokens/SOL");
      if (!response.ok) throw new Error("Failed to fetch opportunities");
      const data = await response.json();
      
      // Process pairs to find arbitrage opportunities
      const opportunities: ArbitrageOpportunity[] = [];
      const tokenPairs = new Map();
      
      data.pairs?.forEach((pair: any) => {
        if (!tokenPairs.has(pair.baseToken.symbol)) {
          tokenPairs.set(pair.baseToken.symbol, []);
        }
        tokenPairs.get(pair.baseToken.symbol).push({
          dex: pair.dexId,
          price: parseFloat(pair.priceUsd),
          volume: parseFloat(pair.volume24h)
        });
      });

      // Find price differences
      tokenPairs.forEach((pairs, symbol) => {
        if (pairs.length >= 2) {
          for (let i = 0; i < pairs.length; i++) {
            for (let j = i + 1; j < pairs.length; j++) {
              const spread = Math.abs(pairs[i].price - pairs[j].price) / Math.min(pairs[i].price, pairs[j].price) * 100;
              if (spread > 1) { // Only show opportunities with >1% spread
                opportunities.push({
                  tokenSymbol: symbol,
                  dex1: pairs[i].dex,
                  dex2: pairs[j].dex,
                  price1: pairs[i].price,
                  price2: pairs[j].price,
                  spread: spread,
                  volume24h: Math.min(pairs[i].volume, pairs[j].volume),
                  estimatedProfit: (spread / 100) * Math.min(pairs[i].volume, pairs[j].volume) * 0.95 // 95% success rate
                });
              }
            }
          }
        }
      });

      return opportunities.sort((a, b) => b.estimatedProfit - a.estimatedProfit).slice(0, 5);
    },
    refetchInterval: 30000
  });

  const handleTrack = (opportunity: ArbitrageOpportunity) => {
    toast.success("Tracking opportunity", {
      description: `Now monitoring ${opportunity.tokenSymbol} price difference between ${opportunity.dex1} and ${opportunity.dex2}`
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Arbitrage Scanner</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          className={isLoading ? "animate-spin" : ""}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Progress value={60} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              Scanning for arbitrage opportunities...
            </p>
          </div>
        ) : opportunities && opportunities.length > 0 ? (
          <div className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <Card key={index} className="hover-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{opportunity.tokenSymbol}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{opportunity.dex1}</span>
                        <ArrowRightLeft className="mx-2 h-4 w-4" />
                        <span>{opportunity.dex2}</span>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleTrack(opportunity)}>
                      Track
                    </Button>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Spread</p>
                      <p className="font-medium text-green-500">
                        {formatPercentage(opportunity.spread)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">24h Volume</p>
                      <p className="font-medium">
                        {formatMarketCap(opportunity.volume24h)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Est. Profit</p>
                      <p className="font-medium text-green-500">
                        {formatMarketCap(opportunity.estimatedProfit)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mb-4" />
            <p className="text-sm text-muted-foreground">
              No significant arbitrage opportunities found at the moment.
              <br />
              Keep scanning for new opportunities.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArbitrageScanner;