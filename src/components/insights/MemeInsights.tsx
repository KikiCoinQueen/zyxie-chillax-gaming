import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Volume2, Users, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { formatMarketCap, formatPercentage } from "@/utils/formatters";

interface TokenInsight {
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

export const MemeInsights = () => {
  const [timeframe] = useState("24h");

  const { data: insights, isLoading } = useQuery({
    queryKey: ["memeInsights", timeframe],
    queryFn: async () => {
      try {
        const response = await fetch(
          "https://api.dexscreener.com/latest/dex/tokens/SOL"
        );
        if (!response.ok) throw new Error("Failed to fetch token data");
        const data = await response.json();
        
        if (!data?.pairs) {
          console.log("No pairs data received:", data);
          return [];
        }
        
        return data.pairs
          .filter((pair: any) => {
            const volume = parseFloat(pair.volume24h);
            const fdv = parseFloat(pair.fdv);
            return volume > 1000 && fdv < 5000000; // Volume > $1k and FDV < $5M
          })
          .sort((a: any, b: any) => {
            return parseFloat(b.volume24h) - parseFloat(a.volume24h);
          })
          .slice(0, 5);
      } catch (error) {
        console.error("Error fetching insights:", error);
        throw error;
      }
    },
    refetchInterval: 30000,
    meta: {
      onError: () => {
        toast.error("Failed to fetch market insights");
      }
    }
  });

  const calculateRiskScore = (token: TokenInsight): number => {
    const volumeScore = Math.min(parseFloat(token.volume24h) / 10000, 5);
    const liquidityScore = Math.min(token.liquidity.usd / 50000, 5);
    const volatilityScore = Math.min(Math.abs(token.priceChange24h) / 20, 5);
    
    return Math.round((volumeScore + liquidityScore + volatilityScore) / 3);
  };

  const getRiskLabel = (score: number): string => {
    if (score <= 2) return "Low Risk";
    if (score <= 3) return "Medium Risk";
    return "High Risk";
  };

  const getRiskColor = (score: number): string => {
    if (score <= 2) return "text-green-500";
    if (score <= 3) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <section className="py-20 px-4" id="meme-insights">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Meme Coin Market Insights
            </h2>
            <Volume2 className="w-6 h-6 text-primary animate-pulse" />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Market Analysis
                    <Badge variant="secondary">Live Updates</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Token</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>24h Change</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>Risk Level</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {insights?.map((token: TokenInsight) => {
                        const riskScore = calculateRiskScore(token);
                        return (
                          <TableRow key={token.baseToken.address}>
                            <TableCell className="font-medium">
                              {token.baseToken.name}
                              <Badge variant="outline" className="ml-2">
                                {token.baseToken.symbol}
                              </Badge>
                            </TableCell>
                            <TableCell>${Number(token.priceUsd).toFixed(6)}</TableCell>
                            <TableCell className={token.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}>
                              {formatPercentage(token.priceChange24h)}
                            </TableCell>
                            <TableCell>{formatMarketCap(parseFloat(token.volume24h))}</TableCell>
                            <TableCell>
                              <span className={`flex items-center gap-1 ${getRiskColor(riskScore)}`}>
                                <AlertTriangle className="w-4 h-4" />
                                {getRiskLabel(riskScore)}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Trading Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-mono">
                      {formatMarketCap(
                        insights?.reduce((total: number, token: TokenInsight) => 
                          total + parseFloat(token.volume24h), 0) || 0
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Total 24h volume for listed tokens
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Market Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-mono">
                      {insights?.filter((t: TokenInsight) => t.priceChange24h > 0).length || 0}/
                      {insights?.length || 0}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Tokens with positive 24h performance
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Average Risk Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {insights && insights.length > 0 ? (
                      <>
                        <div className="text-2xl font-mono">
                          {(insights.reduce((total: number, token: TokenInsight) => 
                            total + calculateRiskScore(token), 0) / insights.length).toFixed(1)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Based on volume, liquidity, and volatility
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No data available
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Data updates every 30 seconds • Risk scores are calculated based on volume, liquidity, and price volatility
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};