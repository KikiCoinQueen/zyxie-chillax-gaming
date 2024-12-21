import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoinAnalysis } from "@/utils/ai/coinAnalysis";
import { motion } from "framer-motion";
import { formatPercentage } from "@/utils/formatters";

interface CoinAnalysisCardProps {
  analysis: CoinAnalysis;
  symbol: string;
  marketCap?: number;
  priceChange?: number;
}

export const CoinAnalysisCard = ({ analysis, symbol, marketCap, priceChange }: CoinAnalysisCardProps) => {
  const getRiskColor = (risk: string) => {
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
          <span>{symbol} Analysis</span>
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
              ${marketCap?.toLocaleString() || 'N/A'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price Change</span>
            <span className={`font-mono ${typeof priceChange === 'number' && priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {typeof priceChange === 'number' ? formatPercentage(priceChange) : 'N/A'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Market Trend</span>
            <span className="font-medium">{analysis.marketTrend}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Estimated Age</span>
            <span className="font-medium">{analysis.creationDate}</span>
          </div>

          <div className="pt-4 border-t border-border/50">
            <p className="text-sm font-medium mb-1">AI Recommendation</p>
            <p className="text-sm text-muted-foreground">{analysis.recommendation}</p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};