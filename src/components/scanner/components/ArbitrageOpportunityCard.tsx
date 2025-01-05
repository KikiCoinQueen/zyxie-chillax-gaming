import { motion } from "framer-motion";
import { ArrowRight, Wallet, Shield, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface ArbitrageOpportunityCardProps {
  opportunity: ArbitrageOpportunity;
}

export const ArbitrageOpportunityCard = ({ opportunity }: ArbitrageOpportunityCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold">{opportunity.tokenSymbol}</h3>
              <p className="text-sm text-muted-foreground">
                Arbitrage Opportunity
              </p>
            </div>
            <Badge
              variant={opportunity.riskLevel === "High" ? "destructive" : "secondary"}
              className="ml-2"
            >
              {opportunity.riskLevel} Risk
            </Badge>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm">
              <p className="text-muted-foreground">{opportunity.dex1.name}</p>
              <p className="font-mono font-semibold">
                ${opportunity.dex1.price.toFixed(6)}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-primary mx-2" />
            <div className="text-sm text-right">
              <p className="text-muted-foreground">{opportunity.dex2.name}</p>
              <p className="font-mono font-semibold">
                ${opportunity.dex2.price.toFixed(6)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col items-center p-2 bg-secondary/10 rounded-lg">
              <Activity className="w-4 h-4 text-primary mb-1" />
              <span className="text-xs text-muted-foreground">Profit</span>
              <span className="font-semibold text-green-500">
                {opportunity.profitPercentage.toFixed(2)}%
              </span>
            </div>
            <div className="flex flex-col items-center p-2 bg-secondary/10 rounded-lg">
              <Wallet className="w-4 h-4 text-primary mb-1" />
              <span className="text-xs text-muted-foreground">Est. USD</span>
              <span className="font-semibold">
                ${opportunity.estimatedProfit.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col items-center p-2 bg-secondary/10 rounded-lg">
              <Shield className="w-4 h-4 text-primary mb-1" />
              <span className="text-xs text-muted-foreground">Liquidity</span>
              <span className="font-semibold">
                ${opportunity.liquidityScore.toFixed(1)}M
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Found {Math.floor((Date.now() - opportunity.timestamp) / 1000)}s ago
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};