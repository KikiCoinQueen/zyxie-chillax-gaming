import { ExternalLink } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangle } from "lucide-react";

interface CardHeaderProps {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
}

export const CoinCardHeader = ({ id, name, symbol, market_cap_rank, thumb }: CardHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center gap-4">
      <div className="relative">
        {thumb ? (
          <img
            src={thumb}
            alt={name}
            className="w-12 h-12 rounded-full ring-2 ring-primary/20"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
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
  );
};