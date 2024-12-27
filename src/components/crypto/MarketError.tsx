import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

interface MarketErrorProps {
  onRetry: () => void;
}

export const MarketError = ({ onRetry }: MarketErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive animate-pulse" />
      <h3 className="text-xl font-semibold">Failed to Load Trending Coins</h3>
      <p className="text-muted-foreground mb-4">
        We're having trouble fetching the latest market data
      </p>
      <Button 
        onClick={onRetry}
        className="animate-pulse"
      >
        Try Again
      </Button>
    </div>
  );
};