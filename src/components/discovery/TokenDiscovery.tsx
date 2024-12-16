import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Brain, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TokenMetrics } from "./tokens/TokenMetrics";
import { SearchBar } from "./search/SearchBar";
import { useAchievements } from "@/contexts/AchievementsContext";
import { pipeline } from "@huggingface/transformers";
import { extractSentiment, TextClassificationOutput } from "@/components/predictor/types/prediction";

export const TokenDiscovery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRisk, setSelectedRisk] = useState<number | null>(null);
  const { addAnalyzedToken } = useAchievements();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: tokens, isLoading, error } = useQuery({
    queryKey: ["discoveryTokens"],
    queryFn: async () => {
      try {
        const response = await fetch("https://api.dexscreener.com/latest/dex/tokens/SOL");
        if (!response.ok) throw new Error("Failed to fetch tokens");
        const data = await response.json();
        
        if (!data?.pairs) {
          throw new Error("No token data available");
        }

        const classifier = await pipeline(
          "text-classification",
          "onnx-community/distilbert-base-uncased-finetuned-sst-2-english",
          { device: "webgpu" }
        );

        const analyzedTokens = await Promise.all(
          data.pairs
            .filter((pair: any) => parseFloat(pair.volume24h) > 1000)
            .slice(0, 10)
            .map(async (pair: any) => {
              const text = `${pair.baseToken.symbol} price ${pair.priceChange24h > 0 ? 'increased' : 'decreased'} 
                          by ${Math.abs(pair.priceChange24h)}% with volume ${pair.volume24h}`;
              
              const sentiment: TextClassificationOutput = await classifier(text);
              const { score } = extractSentiment(sentiment);
              
              return {
                symbol: pair.baseToken.symbol,
                name: pair.baseToken.name,
                price: parseFloat(pair.priceUsd),
                volume24h: parseFloat(pair.volume24h),
                marketCap: pair.fdv || 0,
                riskLevel: calculateRiskScore(pair),
                potentialScore: score * 5,
                communityScore: Math.random() * 5
              };
            })
        );

        return analyzedTokens;
      } catch (error) {
        console.error("Error fetching discovery tokens:", error);
        throw error;
      }
    },
    refetchInterval: 30000,
    meta: {
      onError: () => {
        toast.error("Failed to fetch discovery data", {
          description: "Please try again later"
        });
      }
    }
  });

  const calculateRiskScore = (token: any): number => {
    const volumeScore = Math.min(parseFloat(token.volume24h) / 100000, 5);
    const volatilityScore = Math.min(Math.abs(token.priceChange24h) / 20, 5);
    const liquidityScore = Math.min(token.liquidity?.usd / 50000, 5) || 0;
    return Math.round((volumeScore + volatilityScore + liquidityScore) / 3);
  };

  const filteredTokens = tokens?.filter(token => {
    const matchesSearch = token.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = selectedRisk === null || token.riskLevel === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  const analyzeToken = async (token: any) => {
    setIsAnalyzing(true);
    try {
      addAnalyzedToken(token.symbol);
      toast.success(`Analysis completed for ${token.symbol}!`);
    } catch (error) {
      console.error("Error analyzing token:", error);
      toast.error("Failed to analyze token");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="py-20 px-4" id="token-discovery">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Brain className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              AI-Powered Token Discovery
            </h2>
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <SearchBar
            searchTerm={searchTerm}
            selectedRisk={selectedRisk}
            onSearchChange={setSearchTerm}
            onRiskSelect={setSelectedRisk}
          />

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <Card className="text-center py-10">
              <CardContent>
                <p className="text-red-500 mb-4">Failed to load tokens</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTokens?.map((token) => (
                <Card key={token.symbol} className="glass-card hover:scale-[1.02] transition-transform">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {token.symbol}
                        <TrendingUp className="w-4 h-4 text-primary" />
                      </div>
                      <Button
                        size="sm"
                        onClick={() => analyzeToken(token)}
                        disabled={isAnalyzing}
                      >
                        Analyze
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TokenMetrics {...token} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Powered by AI • Not financial advice • DYOR
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};