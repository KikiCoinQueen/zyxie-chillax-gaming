import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface PortfolioStatsProps {
  totalValue: number;
  totalCost: number;
}

export const PortfolioStats = ({ totalValue, totalCost }: PortfolioStatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle>Total Value</CardTitle>
        <CardDescription>Current portfolio value in USD</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-mono">
          ${totalValue.toLocaleString()}
        </p>
      </CardContent>
    </Card>
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle>Total Cost</CardTitle>
        <CardDescription>Initial investment in USD</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-mono">
          ${totalCost.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  </div>
);