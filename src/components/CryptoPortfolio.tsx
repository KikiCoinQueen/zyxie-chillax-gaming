import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { PortfolioHeader } from "./portfolio/PortfolioHeader";
import { AddCoinForm } from "./portfolio/AddCoinForm";
import { PortfolioStats } from "./portfolio/PortfolioStats";
import { CoinList } from "./portfolio/CoinList";

interface CoinHolding {
  id: string;
  symbol: string;
  amount: number;
  buyPrice: number;
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
            <PortfolioHeader />
            <CardContent>
              <div className="grid gap-6">
                <AddCoinForm
                  newCoin={newCoin}
                  setNewCoin={setNewCoin}
                  onAddCoin={handleAddCoin}
                />
                <PortfolioStats
                  totalValue={calculateTotalValue()}
                  totalCost={calculateTotalCost()}
                />
                <CoinList
                  holdings={holdings}
                  prices={prices || {}}
                  onRemoveCoin={handleRemoveCoin}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};