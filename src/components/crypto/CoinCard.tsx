import { TrendingUp, TrendingDown, ExternalLink, Volume2, Users, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { formatPercentage, formatMarketCap, getSentimentColor, getCommunityScore } from "@/utils/formatters";
import { motion } from "framer-motion";

interface CoinData {
  price_change_percentage_24h?: number;
  market_cap?: number;
  total_volume?: number;
  sentiment_votes_up_percentage?: number;
  community_score?: number;
}

interface CoinCardProps {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  price_btc: number;
  data: CoinData;
}

export const CoinCard = ({ id, name, symbol, market_cap_rank, thumb, price_btc, data }: CoinCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-xl overflow-hidden relative group"
    >
      <Card className="border-0 bg-transparent h-full">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="relative">
            <img
              src={thumb}
              alt={name}
              className="w-12 h-12 rounded-full ring-2 ring-primary/20"
            />
            <Badge 
              className="absolute -top-2 -right-2 bg-primary/20 backdrop-blur-sm"
              variant="secondary"
            >
              #{market_cap_rank || 'N/A'}
            </Badge>
          </div>
          <div>
            <CardTitle className="text-lg">
              <span className="mr-2">{name}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0 hover:bg-transparent"
                      onClick={() => window.open(`https://www.coingecko.com/en/coins/${id}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View on CoinGecko</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              {symbol.toUpperCase()}
              <span className="px-2 py-0.5 text-xs bg-muted rounded-full">
                Meme Coin
              </span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Price (BTC)</span>
              <div className="flex items-center gap-1 text-primary font-mono">
                <span>{price_btc.toFixed(8)}</span>
                {data?.price_change_percentage_24h ? (
                  data.price_change_percentage_24h > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-4 h-4" />
                  Volume 24h
                </span>
                <span className="font-mono">
                  {formatMarketCap(data?.total_volume)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Community Score
                </span>
                <span className={`font-medium ${getSentimentColor(data?.community_score)}`}>
                  {getCommunityScore(data?.community_score)}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Risk Level
                  </span>
                  <span className="text-yellow-500 font-medium">High</span>
                </div>
                <Progress 
                  value={75} 
                  className="h-1.5 bg-muted"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
              <div>
                <p className="text-xs text-muted-foreground mb-1">24h Change</p>
                <p className={`font-mono text-sm ${
                  data?.price_change_percentage_24h && 
                  data.price_change_percentage_24h > 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {formatPercentage(data?.price_change_percentage_24h)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
                <p className="font-mono text-sm">
                  {formatMarketCap(data?.market_cap)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};