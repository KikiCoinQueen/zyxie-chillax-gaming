import { DollarSign } from "lucide-react";
import { Label } from "@/components/ui/label";

interface CalculationResultsProps {
  tokens: string;
  potentialValue: string;
  potentialReturn: string;
  roi: string;
  riskLevel: number;
}

export const CalculationResults = ({
  tokens,
  potentialValue,
  potentialReturn,
  roi,
  riskLevel,
}: CalculationResultsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">
            Tokens Received
          </Label>
          <p className="text-xl font-mono">{tokens}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">
            Potential Value
          </Label>
          <p className="text-xl font-mono text-green-500">
            ${potentialValue}
          </p>
        </div>
      </div>

      <div className="space-y-2 border-t border-border/50 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Potential Return
          </span>
          <span className="font-mono text-green-500">
            ${potentialReturn}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">ROI</span>
          <span className="font-mono text-green-500">
            {roi}%
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
    </div>
  );
};