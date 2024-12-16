import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, AlertTriangle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface DiscoveryToken {
  symbol: string;
  name: string;
  price: number;
  volume24h: number;
  marketCap: number;
  riskLevel: number;
  potentialScore: number;
  communityScore: number;
}

export const MemeDiscovery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRisk, setSelectedRisk] = useState<number | null>(null);

  const { data: tokens, isLoading } = useQuery({
    queryKey: ["discoveryTokens", searchTerm, selectedRisk],
    queryFn: async () => {
      // This would be replaced with actual API calls in production
      const mockTokens: DiscoveryToken[] = [
        {
          symbol: "PEPE",
          name: "Pepe Coin",
          price: 0.000001,
          volume24h: 1000000,
          marketCap: 5000000,
          riskLevel: 4.2,
          potentialScore: 3.8,
          communityScore: 4.5
        },
        {
          symbol: "DOGE",
          name: "Dogecoin",
          price: 0.1,
          volume24h: 5000000,
          marketCap: 10000000,
          riskLevel: 3.5,
          potentialScore: 4.2,
          communityScore: 4.8
        }
      ];

      return mockTokens.filter(token => 
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!selectedRisk || Math.abs(token.riskLevel - selectedRisk) < 1)
      );
    },
    refetchInterval: 30000
  });

  const getRiskColor = (risk: number): string => {
    if (risk >= 4) return "text-red-500";
    if (risk >= 3) return "text-yellow-500";
    return "text-green-500";
  };

  const getPotentialBadge = (score: number) => {
    if (score >= 4) return "🌟 High Potential";
    if (score >= 3) return "⭐ Promising";
    return "💫 Speculative";
  };

  return (
    <section className="py-20 px-4" id="discovery">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Search className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Meme Coin Discovery
            </h2>
            <Star className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <div className="max-w-xl mx-auto mb-8">
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="Search by symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-card"
              />
              <Button
                variant="outline"
                onClick={() => setSelectedRisk(null)}
                className={!selectedRisk ? "bg-primary/20" : ""}
              >
                All Risks
              </Button>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5].map((risk) => (
                <Button
                  key={risk}
                  variant="outline"
                  onClick={() => setSelectedRisk(risk)}
                  className={selectedRisk === risk ? "bg-primary/20" : ""}
                >
                  Risk {risk}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens?.map((token) => (
                <Card key={token.symbol} className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        {token.symbol}
                        <span className="text-sm text-muted-foreground ml-2">
                          {token.name}
                        </span>
                      </div>
                      <Badge>
                        {getPotentialBadge(token.potentialScore)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Risk Level</span>
                          <span className={`font-mono ${getRiskColor(token.riskLevel)}`}>
                            {token.riskLevel.toFixed(1)}/5
                          </span>
                        </div>
                        <Progress 
                          value={token.riskLevel * 20} 
                          className="h-1.5"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Growth Potential</span>
                          <span className="font-mono">
                            {token.potentialScore.toFixed(1)}/5
                          </span>
                        </div>
                        <Progress 
                          value={token.potentialScore * 20} 
                          className="h-1.5"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Community Score</span>
                          <span className="font-mono">
                            {token.communityScore.toFixed(1)}/5
                          </span>
                        </div>
                        <Progress 
                          value={token.communityScore * 20} 
                          className="h-1.5"
                        />
                      </div>

                      <div className="pt-4 border-t border-border/50">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Price</p>
                            <p className="font-mono">
                              ${token.price.toFixed(6)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Volume 24h</p>
                            <p className="font-mono">
                              ${token.volume24h.toLocaleString()}
                            </p>
                          </div>
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
              Discover new opportunities • Filter by risk level • Always DYOR
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};