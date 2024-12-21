import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Twitter } from "lucide-react";
import { CoinAnalysis } from "@/utils/ai/coinAnalysis";
import { motion } from "framer-motion";
import { formatPercentage, formatMarketCap } from "@/utils/formatters";

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
            {analysis.twitterHandle && (
              <a
                href={`https://twitter.com/${analysis.twitterHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
          <Badge variant="outline" className={getRiskColor(analysis.riskLevel)}>
            {analysis.riskLevel} Risk
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Market Cap</span>
            <span className="font-mono">
              {marketCap ? formatMarketCap(marketCap) : 'N/A'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">24h Price Change</span>
            <span className={`font-mono ${typeof priceChange === 'number' && priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {typeof priceChange === 'number' ? formatPercentage(priceChange) : 'N/A'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Market Trend</span>
            <span className="font-medium">{analysis.marketTrend}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Age</span>
            <span className="font-medium">{analysis.creationDate}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Interest Score</span>
              <span className="font-mono">{analysis.interestScore.toFixed(1)}/5</span>
            </div>
            <Progress value={analysis.interestScore * 20} className="h-1.5" />
          </div>

          <div className="pt-4 border-t border-border/50">
            <p className="text-sm font-medium mb-2">AI Analysis</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.recommendation}
            </p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};