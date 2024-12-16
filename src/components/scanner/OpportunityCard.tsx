import { motion } from "framer-motion";
import { Volume2, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatMarketCap, formatPercentage } from "@/utils/formatters";
import { TokenOpportunity } from "./types";

export const OpportunityCard = ({ token }: { token: TokenOpportunity }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <Card className="border-0 bg-transparent h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {token.baseToken.symbol}
              <Badge variant="secondary" className="text-xs">
                {token.opportunityScore.total.toFixed(1)}/5
              </Badge>
            </div>
            <span className={`text-sm ${
              token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {formatPercentage(token.priceChange24h)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-4 h-4" />
                  Volume Score
                </span>
                <span className="font-mono">
                  {token.opportunityScore.volumeScore.toFixed(1)}/5
                </span>
              </div>
              <Progress 
                value={token.opportunityScore.volumeScore * 20} 
                className="h-1.5"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Price Score
                </span>
                <span className="font-mono">
                  {token.opportunityScore.priceScore.toFixed(1)}/5
                </span>
              </div>
              <Progress 
                value={token.opportunityScore.priceScore * 20} 
                className="h-1.5"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Growth Potential
                </span>
                <span className="font-mono">
                  {token.opportunityScore.socialScore.toFixed(1)}/5
                </span>
              </div>
              <Progress 
                value={token.opportunityScore.socialScore * 20} 
                className="h-1.5"
              />
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">24h Volume</p>
                  <p className="font-mono text-sm">
                    {formatMarketCap(parseFloat(token.volume24h))}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">FDV</p>
                  <p className="font-mono text-sm">
                    {formatMarketCap(token.fdv)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};