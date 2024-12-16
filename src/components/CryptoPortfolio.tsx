import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CoinHolding {
  id: string;
  symbol: string;
  amount: number;
  buyPrice: number;
}

interface CoinPrice {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

export const CryptoPortfolio = () => {
  const [holdings, setHoldings] = useState<CoinHolding[]>(() => {
    const saved = localStorage.getItem("cryptoHoldings");
    return saved ? JSON.parse(saved) : [];
  });
  const [newCoin, setNewCoin] = useState({ symbol: "", amount: "", buyPrice: "" });

  const { data: prices } = useQuery({
    queryKey: ["coinPrices", holdings.map(h => h.symbol).join(",")],
    queryFn: async () => {
      if (holdings.length === 0) return {};
      const symbols = holdings.map(h => h.symbol.toLowerCase()).join(",");
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbols}&vs_currencies=usd&include_24hr_change=true`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch prices");
      }
      return response.json();
    },
    enabled: holdings.length > 0,
    refetchInterval: 60000,
    meta: {
      onError: () => {
        toast.error("Failed to fetch current prices");
      }
    }
  });

  const handleAddCoin = () => {
    if (!newCoin.symbol || !newCoin.amount || !newCoin.buyPrice) {
      toast.error("Please fill in all fields");
      return;
    }

    const holding: CoinHolding = {
      id: Date.now().toString(),
      symbol: newCoin.symbol.toLowerCase(),
      amount: parseFloat(newCoin.amount),
      buyPrice: parseFloat(newCoin.buyPrice),
    };

    setHoldings(prev => {
      const updated = [...prev, holding];
      localStorage.setItem("cryptoHoldings", JSON.stringify(updated));
      return updated;
    });
    setNewCoin({ symbol: "", amount: "", buyPrice: "" });
    toast.success("Coin added to portfolio");
  };

  const handleRemoveCoin = (id: string) => {
    setHoldings(prev => {
      const updated = prev.filter(h => h.id !== id);
      localStorage.setItem("cryptoHoldings", JSON.stringify(updated));
      return updated;
    });
    toast.success("Coin removed from portfolio");
  };

  const calculateTotalValue = () => {
    return holdings.reduce((total, holding) => {
      const currentPrice = prices?.[holding.symbol]?.usd || 0;
      return total + (holding.amount * currentPrice);
    }, 0);
  };

  const calculateTotalCost = () => {
    return holdings.reduce((total, holding) => {
      return total + (holding.amount * holding.buyPrice);
    }, 0);
  };

  return (
    <section className="py-20 px-4" id="portfolio">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-3xl font-display font-bold gradient-text">
                Crypto Portfolio
              </CardTitle>
              <CardDescription>
                Track your holdings and potential gains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-wrap gap-4">
                  <Input
                    placeholder="Coin ID (e.g., bitcoin)"
                    value={newCoin.symbol}
                    onChange={e => setNewCoin(prev => ({ ...prev, symbol: e.target.value }))}
                    className="w-full sm:w-auto"
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={newCoin.amount}
                    onChange={e => setNewCoin(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full sm:w-auto"
                  />
                  <Input
                    type="number"
                    placeholder="Buy price (USD)"
                    value={newCoin.buyPrice}
                    onChange={e => setNewCoin(prev => ({ ...prev, buyPrice: e.target.value }))}
                    className="w-full sm:w-auto"
                  />
                  <Button onClick={handleAddCoin} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Coin
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle>Total Value</CardTitle>
                      <CardDescription>Current portfolio value in USD</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-mono">
                        ${calculateTotalValue().toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle>Total Cost</CardTitle>
                      <CardDescription>Initial investment in USD</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-mono">
                        ${calculateTotalCost().toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  {holdings.map(holding => {
                    const currentPrice = prices?.[holding.symbol]?.usd || 0;
                    const priceChange = prices?.[holding.symbol]?.usd_24h_change || 0;
                    const totalValue = holding.amount * currentPrice;
                    const totalCost = holding.amount * holding.buyPrice;
                    const profit = totalValue - totalCost;
                    const profitPercentage = ((totalValue - totalCost) / totalCost) * 100;

                    return (
                      <motion.div
                        key={holding.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="p-4 rounded-lg bg-card/50 border border-border/50"
                      >
                        <div className="flex flex-wrap justify-between items-center gap-4">
                          <div>
                            <h3 className="text-lg font-semibold">{holding.symbol.toUpperCase()}</h3>
                            <p className="text-sm text-muted-foreground">
                              {holding.amount} coins @ ${holding.buyPrice}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-mono">${totalValue.toLocaleString()}</p>
                            <div className="flex items-center gap-2">
                              {profit >= 0 ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              )}
                              <span className={profit >= 0 ? "text-green-500" : "text-red-500"}>
                                {profitPercentage.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCoin(holding.id)}
                            className="text-destructive hover:text-destructive/90"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};