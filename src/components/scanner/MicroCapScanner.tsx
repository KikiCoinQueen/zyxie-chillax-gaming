import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Brain, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MicroCapToken {
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  liquidity: number;
  riskScore: number;
  potentialScore: number;
}

const calculatePotentialScore = (token: MicroCapToken): number => {
  let score = 0;
  
  // Volume to Market Cap ratio (higher is better)
  const volumeToMcap = token.volume24h / token.marketCap;
  if (volumeToMcap > 0.3) score += 30;
  else if (volumeToMcap > 0.1) score += 20;
  else if (volumeToMcap > 0.05) score += 10;
  
  // Holder count (more holders = more stability)
  if (token.holders > 1000) score += 20;
  else if (token.holders > 500) score += 15;
  else if (token.holders > 100) score += 10;
  
  // Liquidity check (higher liquidity = lower risk)
  const liquidityRatio = token.liquidity / token.marketCap;
  if (liquidityRatio > 0.2) score += 30;
  else if (liquidityRatio > 0.1) score += 20;
  else if (liquidityRatio > 0.05) score += 10;
  
  // Market cap check (looking for true micro caps)
  if (token.marketCap < 100000) score += 20;
  else if (token.marketCap < 500000) score += 15;
  else if (token.marketCap < 1000000) score += 10;
  
  return Math.min(score, 100);
};

const mockFetchMicroCaps = async (): Promise<MicroCapToken[]> => {
  // Simulated API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return [
    {
      symbol: "MICRO1",
      price: 0.00001234,
      marketCap: 75000,
      volume24h: 25000,
      holders: 850,
      liquidity: 15000,
      riskScore: 75,
      potentialScore: 85
    },
    {
      symbol: "MICRO2",
      price: 0.00000789,
      marketCap: 150000,
      volume24h: 35000,
      holders: 1200,
      liquidity: 30000,
      riskScore: 65,
      potentialScore: 78
    },
    {
      symbol: "MICRO3",
      price: 0.00002345,
      marketCap: 250000,
      volume24h: 45000,
      holders: 650,
      liquidity: 40000,
      riskScore: 70,
      potentialScore: 82
    }
  ].map(token => ({
    ...token,
    potentialScore: calculatePotentialScore(token)
  }));
};

export const MicroCapScanner = () => {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);

  const { data: tokens, isLoading } = useQuery({
    queryKey: ['microCaps'],
    queryFn: mockFetchMicroCaps,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleTokenSelect = (symbol: string) => {
    if (selectedTokens.includes(symbol)) {
      setSelectedTokens(prev => prev.filter(t => t !== symbol));
    } else {
      setSelectedTokens(prev => [...prev, symbol]);
      toast.success(`Added ${symbol} to watchlist`);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          MicroCap Scanner
          <Badge variant="secondary" className="ml-2">Beta</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Potential Gems Scanner</h3>
              <p className="text-sm text-muted-foreground">
                Analyzing micro-cap tokens for potential opportunities
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary animate-pulse" />
          </div>

          <ScrollArea className="h-[400px] rounded-md border p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {tokens?.map((token) => (
                  <motion.div
                    key={token.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg border bg-card"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{token.symbol}</h4>
                        <p className="text-sm text-muted-foreground">
                          MCap: ${token.marketCap.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant={selectedTokens.includes(token.symbol) ? "default" : "outline"}
                        onClick={() => handleTokenSelect(token.symbol)}
                      >
                        {selectedTokens.includes(token.symbol) ? "Watching" : "Watch"}
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Potential Score</span>
                          <span className="font-medium">{token.potentialScore}%</span>
                        </div>
                        <Progress value={token.potentialScore} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Activity className="w-4 h-4" />
                            24h Volume
                          </div>
                          <p className="font-medium">${token.volume24h.toLocaleString()}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <AlertTriangle className="w-4 h-4" />
                            Risk Level
                          </div>
                          <p className="font-medium">{token.riskScore}/100</p>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-muted-foreground">Holders:</span>
                        <span className="ml-2 font-medium">{token.holders}</span>
                        <span className="mx-2">•</span>
                        <span className="text-muted-foreground">Liquidity:</span>
                        <span className="ml-2 font-medium">${token.liquidity.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Auto-refreshes every 30 seconds</p>
            <p>High risk - DYOR</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};