import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MicroCapCoin } from "../types/microCap";
import { formatNumber } from "@/utils/formatters";
import { ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";

export interface MicroCapCardProps {
  coin: MicroCapCoin;
}

export const MicroCapCard = ({ coin }: MicroCapCardProps) => {
  const formatPrice = (price: number) => {
    if (price < 0.00001) return price.toExponential(2);
    if (price < 0.01) return price.toFixed(6);
    return price.toFixed(4);
  };

  return (
    <Card className="glass-card hover:scale-[1.02] transition-transform">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{coin.symbol}</span>
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <Badge variant={coin.priceChange24h >= 0 ? "default" : "destructive"}>
            {coin.priceChange24h >= 0 ? "+" : ""}{coin.priceChange24h.toFixed(2)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="font-medium">{coin.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-mono">${formatPrice(coin.price)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Market Cap</span>
            <span className="font-mono">${formatNumber(coin.marketCap)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Volume 24h</span>
            <span className="font-mono">${formatNumber(coin.volume24h)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          {coin.priceChange24h >= 0 ? (
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          )}
          <span className="text-sm text-muted-foreground">
            Rank #{coin.rank}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};