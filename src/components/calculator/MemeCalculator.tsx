import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InvestmentForm } from "./InvestmentForm";
import { CalculationResults } from "./CalculationResults";

export const MemeCalculator = () => {
  const [investment, setInvestment] = useState<number>(100);
  const [targetPrice, setTargetPrice] = useState<number>(0.01);
  const [currentPrice, setCurrentPrice] = useState<number>(0.001);
  const [riskLevel, setRiskLevel] = useState<number>(75);

  const calculatePotentialReturn = () => {
    const tokens = investment / currentPrice;
    const potentialValue = tokens * targetPrice;
    const potentialReturn = potentialValue - investment;
    const roi = (potentialReturn / investment) * 100;
    return {
      tokens: tokens.toFixed(2),
      potentialValue: potentialValue.toFixed(2),
      potentialReturn: potentialReturn.toFixed(2),
      roi: roi.toFixed(2)
    };
  };

  const results = calculatePotentialReturn();

  return (
    <section className="py-20 px-4" id="meme-calculator">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Calculator className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Meme Coin Calculator
            </h2>
            <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Investment Details
                  <Badge variant="secondary" className="text-xs">
                    DYOR
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InvestmentForm
                  investment={investment}
                  currentPrice={currentPrice}
                  targetPrice={targetPrice}
                  riskLevel={riskLevel}
                  onInvestmentChange={setInvestment}
                  onCurrentPriceChange={setCurrentPrice}
                  onTargetPriceChange={setTargetPrice}
                  onRiskLevelChange={setRiskLevel}
                />
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Potential Returns
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        These calculations are estimates only. Meme coins are extremely
                        volatile and risky investments. Never invest more than you can
                        afford to lose.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalculationResults
                  tokens={results.tokens}
                  potentialValue={results.potentialValue}
                  potentialReturn={results.potentialReturn}
                  roi={results.roi}
                  riskLevel={riskLevel}
                />
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              This calculator is for educational purposes only • Not financial advice •{" "}
              <span className="text-primary">DYOR and invest responsibly</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};