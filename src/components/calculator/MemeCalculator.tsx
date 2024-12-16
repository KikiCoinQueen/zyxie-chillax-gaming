import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="investment">Investment Amount (USD)</Label>
                  <Input
                    id="investment"
                    type="number"
                    min="0"
                    value={investment}
                    onChange={(e) => setInvestment(parseFloat(e.target.value) || 0)}
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentPrice">Current Price (USD)</Label>
                  <Input
                    id="currentPrice"
                    type="number"
                    min="0"
                    step="0.000001"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetPrice">Target Price (USD)</Label>
                  <Input
                    id="targetPrice"
                    type="number"
                    min="0"
                    step="0.000001"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Risk Level</Label>
                    <span className="text-sm text-yellow-500 font-medium">
                      {riskLevel}%
                    </span>
                  </div>
                  <Slider
                    value={[riskLevel]}
                    onValueChange={([value]) => setRiskLevel(value)}
                    max={100}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher risk = Higher potential returns but also higher chance of loss
                  </p>
                </div>
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
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">
                      Tokens Received
                    </Label>
                    <p className="text-xl font-mono">{results.tokens}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">
                      Potential Value
                    </Label>
                    <p className="text-xl font-mono text-green-500">
                      ${results.potentialValue}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-border/50 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Potential Return
                    </span>
                    <span className="font-mono text-green-500">
                      ${results.potentialReturn}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ROI</span>
                    <span className="font-mono text-green-500">
                      {results.roi}%
                    </span>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <p className="text-sm font-medium">Investment Strategy</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        With a risk level of {riskLevel}%, consider using stop-loss
                        orders and only investing funds you can afford to lose.
                        Remember to take profits along the way!
                      </p>
                    </div>
                  </div>
                </div>
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