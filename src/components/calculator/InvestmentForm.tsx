import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface InvestmentFormProps {
  investment: number;
  currentPrice: number;
  targetPrice: number;
  riskLevel: number;
  onInvestmentChange: (value: number) => void;
  onCurrentPriceChange: (value: number) => void;
  onTargetPriceChange: (value: number) => void;
  onRiskLevelChange: (value: number) => void;
}

export const InvestmentForm = ({
  investment,
  currentPrice,
  targetPrice,
  riskLevel,
  onInvestmentChange,
  onCurrentPriceChange,
  onTargetPriceChange,
  onRiskLevelChange,
}: InvestmentFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="investment">Investment Amount (USD)</Label>
        <Input
          id="investment"
          type="number"
          min="0"
          value={investment}
          onChange={(e) => onInvestmentChange(parseFloat(e.target.value) || 0)}
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
          onChange={(e) => onCurrentPriceChange(parseFloat(e.target.value) || 0)}
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
          onChange={(e) => onTargetPriceChange(parseFloat(e.target.value) || 0)}
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
          onValueChange={([value]) => onRiskLevelChange(value)}
          max={100}
          step={1}
        />
        <p className="text-xs text-muted-foreground">
          Higher risk = Higher potential returns but also higher chance of loss
        </p>
      </div>
    </div>
  );
};