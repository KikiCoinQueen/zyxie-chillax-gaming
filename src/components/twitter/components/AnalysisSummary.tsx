import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalysisSummaryProps {
  summary: {
    totalTweets: number;
    bullishTweets: number;
    mentionedCoins: string[];
  };
}

export const AnalysisSummary = ({ summary }: AnalysisSummaryProps) => {
  return (
    <Card className="p-6">
      <CardTitle className="mb-4">Analysis Summary</CardTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-muted-foreground mb-1">Total Tweets Analyzed</div>
          <div className="text-2xl font-bold">{summary.totalTweets}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Bullish Signals</div>
          <div className="text-2xl font-bold text-green-500">
            {summary.bullishTweets}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Mentioned Coins</div>
          <div className="flex flex-wrap gap-2">
            {summary.mentionedCoins.map((coin: string) => (
              <Badge key={coin} variant="secondary">{coin}</Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};