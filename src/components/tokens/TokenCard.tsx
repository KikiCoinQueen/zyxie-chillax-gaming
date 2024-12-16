import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Volume2, Users, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatMarketCap, formatPercentage } from "@/utils/formatters";
import { TokenData } from "@/types/token";

interface TokenCardProps {
  token: TokenData;
}

export const TokenCard = ({ token }: TokenCardProps) => {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(token.baseToken.address);
    toast.success("Token address copied to clipboard!");
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass-card rounded-xl overflow-hidden relative group"
    >
      <Card className="border-0 bg-transparent h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {token.baseToken.name}
              <Badge variant="secondary" className="text-xs">
                {token.baseToken.symbol}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleCopyAddress}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <motion.div 
              className="flex justify-between items-center"
              whileHover={{ x: 5 }}
            >
              <span className="text-sm text-muted-foreground">Price</span>
              <span className="font-mono">
                ${Number(token.priceUsd).toFixed(6)}
              </span>
            </motion.div>

            <motion.div 
              className="flex justify-between items-center"
              whileHover={{ x: 5 }}
            >
              <span className="text-sm text-muted-foreground">24h Change</span>
              <span className={`font-mono flex items-center gap-2 ${
                token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {token.priceChange24h >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {formatPercentage(token.priceChange24h)}
              </span>
            </motion.div>

            <div className="space-y-2">
              <motion.div 
                className="flex items-center justify-between text-sm"
                whileHover={{ x: 5 }}
              >
                <span className="flex items-center gap-1">
                  <Volume2 className="w-4 h-4" />
                  Volume 24h
                </span>
                <span className="font-mono">
                  {formatMarketCap(parseFloat(token.volume24h))}
                </span>
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-between text-sm"
                whileHover={{ x: 5 }}
              >
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  FDV
                </span>
                <span className="font-mono">
                  {formatMarketCap(token.fdv)}
                </span>
              </motion.div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <motion.div
                className="text-xs text-muted-foreground text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Click to copy token address
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};