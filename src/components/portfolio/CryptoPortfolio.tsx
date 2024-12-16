import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { PortfolioHeader } from "./PortfolioHeader";
import { AddCoinForm } from "./AddCoinForm";
import { CoinList } from "./CoinList";

interface CoinData {
  id: string;
  symbol: string;
  amount: string;
  buyPrice: string;
  currentPrice?: number;
  profitLoss?: number;
}

export const CryptoPortfolio = () => {
  const [portfolio, setPortfolio] = useState<CoinData[]>(() => {
    const saved = localStorage.getItem("portfolio");
    return saved ? JSON.parse(saved) : [];
  });

  const [newCoin, setNewCoin] = useState<Omit<CoinData, 'id'>>({
    symbol: "",
    amount: "",
    buyPrice: ""
  });

  const handleAddCoin = () => {
    if (!newCoin.symbol || !newCoin.amount || !newCoin.buyPrice) {
      toast.error("Please fill in all fields");
      return;
    }

    const coin: CoinData = {
      ...newCoin,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    const updatedPortfolio = [...portfolio, coin];
    setPortfolio(updatedPortfolio);
    localStorage.setItem("portfolio", JSON.stringify(updatedPortfolio));
    setNewCoin({ symbol: "", amount: "", buyPrice: "" });
    toast.success("Coin added to portfolio!");
  };

  const handleRemoveCoin = (index: number) => {
    const updatedPortfolio = portfolio.filter((_, i) => i !== index);
    setPortfolio(updatedPortfolio);
    localStorage.setItem("portfolio", JSON.stringify(updatedPortfolio));
    toast.success("Coin removed from portfolio!");
  };

  return (
    <section className="py-20 px-4" id="portfolio">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Wallet className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Meme Coin Portfolio
            </h2>
            <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <Card className="glass-card">
            <PortfolioHeader />
            <CardContent className="space-y-6">
              <AddCoinForm
                newCoin={newCoin}
                setNewCoin={setNewCoin}
                onAddCoin={handleAddCoin}
              />
              <CoinList
                portfolio={portfolio}
                onRemoveCoin={handleRemoveCoin}
              />
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Track your meme coin investments • Data saved locally • 
              <span className="text-primary ml-1">DYOR and invest responsibly</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};