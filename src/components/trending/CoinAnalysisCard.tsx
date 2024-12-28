import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Twitter, ExternalLink, TrendingUp, TrendingDown, AlertTriangle, Clock, Users, Activity } from "lucide-react";
import { CoinAnalysis } from "@/utils/ai/coinAnalysis";
import { motion } from "framer-motion";
import { formatPercentage, formatMarketCap } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CoinAnalysisCardProps {
  analysis: CoinAnalysis;
  symbol: string;
  marketCap?: number;
  priceChange?: number;
  rank: number;
}

export const CoinAnalysisCard = ({
  analysis,
  symbol,
  marketCap,
  priceChange,
  rank
}: CoinAnalysisCardProps) => {
  const getRiskColor = (risk: string): string => {
    switch (risk) {
      case "Very High": return "text-red-500";
      case "High": return "text-orange-500";
      case "Medium": return "text-yellow-500";
      default: return "text-green-500";
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>#{rank}</span>
            <span>{symbol}</span>
            <div className="flex gap-2">
              {analysis.twitterHandle && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={`https://twitter.com/${analysis.twitterHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow on Twitter</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {analysis.coingeckoUrl && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={analysis.coingeckoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View on CoinGecko</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          <Badge variant="outline" className={getRiskColor(analysis.riskLevel)}>
            {analysis.riskLevel} Risk
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Market Cap</span>
                <span className="font-mono">
                  {marketCap ? formatMarketCap(marketCap) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>24h Change</span>
                <span className={`font-mono flex items-center gap-1 ${
                  typeof priceChange === 'number' && priceChange >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {typeof priceChange === 'number' ? (
                    <>
                      {priceChange >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {formatPercentage(priceChange)}
                    </>
                  ) : 'N/A'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Interest Score</span>
                <span className="font-mono">{analysis.interestScore.toFixed(1)}/5</span>
              </div>
              <Progress value={analysis.interestScore * 20} className="h-1.5" />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-start gap-2">
              <Activity className="w-4 h-4 text-primary mt-1" />
              <div>
                <p className="text-sm font-medium">Technical Analysis</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {analysis.technicalAnalysis}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-primary mt-1" />
              <div>
                <p className="text-sm font-medium">Community Insight</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {analysis.communityInsight}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-primary mt-1" />
              <div>
                <p className="text-sm font-medium">Investment Horizon</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {analysis.investmentHorizon}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-border/50">
            <p className="text-sm font-medium">Risk Factors:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {analysis.riskFactors.map((factor, index) => (
                <li key={index} className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>

          {analysis.potentialCatalysts.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-border/50">
              <p className="text-sm font-medium">Potential Catalysts:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {analysis.potentialCatalysts.map((catalyst, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    {catalyst}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t border-border/50">
            <p className="text-sm font-medium mb-2">AI Recommendation</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {analysis.recommendation}
            </p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};