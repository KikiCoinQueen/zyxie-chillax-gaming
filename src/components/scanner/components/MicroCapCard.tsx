import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MicroCapCoin } from "../types/microCap";
import { formatMarketCap, formatPercentage } from "@/utils/formatters";
import { TrendingUp, Volume2, AlertTriangle } from "lucide-react";

interface MicroCapCardProps {
  coin: MicroCapCoin;
  isSelected: boolean;
  onSelect: () => void;
}

export const MicroCapCard = ({ coin, isSelected, onSelect }: MicroCapCardProps) => {
  return (
    <Card 
      className={`
        glass-card hover:scale-[1.02] transition-all cursor-pointer
        ${isSelected ? 'ring-2 ring-primary' : ''}
      `}
      onClick={onSelect}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {coin.image && (
              <img 
                src={coin.image} 
                alt={coin.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="flex flex-col">
              <span className="text-lg">{coin.symbol.toUpperCase()}</span>
              <span className="text-xs text-muted-foreground">{coin.name}</span>
            </div>
          </div>
          <Badge variant="outline">
            MCap: {formatMarketCap(coin.marketCap)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">24h Change</span>
              <span className={`font-mono ${
                coin.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {formatPercentage(coin.priceChange24h)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">24h Volume</span>
              <span className="font-mono">{formatMarketCap(coin.volume24h)}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Volume/MCap</span>
            <span className="font-mono">
              {((coin.volume24h / coin.marketCap) * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        {coin.marketCap > 50000000 && (
          <div className="flex items-center gap-2 text-yellow-500 text-sm mt-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Higher market cap - monitor closely</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};