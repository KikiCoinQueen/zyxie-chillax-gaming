import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, AlertTriangle, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "./search/SearchBar";
import { TokenMetrics } from "./tokens/TokenMetrics";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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
          ) : tokens?.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p>No opportunities found at the moment.</p>
              <p className="text-sm mt-2">Check back soon for new gems!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens?.map((token: DiscoveryToken) => (
                <Card key={token.symbol} className="glass-card">
                  <CardContent className="pt-6">
                    <TokenMetrics {...token} />
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