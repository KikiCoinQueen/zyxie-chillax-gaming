import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Volume2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMarketCap, formatPercentage } from "@/utils/formatters";
import { TokenData } from "@/types/token";

interface TokenCardProps {
  token: TokenData;
}

export const TokenCard = ({ token }: TokenCardProps) => {
  return (
    <Card className="glass-card hover:scale-[1.02] transition-transform">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {token.baseToken.name}
          <Badge variant="secondary" className="text-xs">
            {token.baseToken.symbol}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-mono">
              ${Number(token.priceUsd).toFixed(6)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">24h Change</span>
            <span className={`font-mono ${
              token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {formatPercentage(token.priceChange24h)}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Volume2 className="w-4 h-4" />
                Volume 24h
              </span>
              <span className="font-mono">
                {formatMarketCap(parseFloat(token.volume24h))}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                FDV
              </span>
              <span className="font-mono">
                {formatMarketCap(token.fdv)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};