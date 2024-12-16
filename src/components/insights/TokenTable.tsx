import { AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatMarketCap, formatPercentage } from "@/utils/formatters";
import { calculateRiskScore, getRiskLabel, getRiskColor } from "./insightUtils";
import { TokenInsight } from "./types";

interface TokenTableProps {
  insights: TokenInsight[];
}

export const TokenTable = ({ insights }: TokenTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>24h Change</TableHead>
          <TableHead>Volume</TableHead>
          <TableHead>Risk Level</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {insights?.map((token: TokenInsight) => {
          const riskScore = calculateRiskScore(token);
          return (
            <TableRow key={token.baseToken.address}>
              <TableCell className="font-medium">
                {token.baseToken.name}
                <Badge variant="outline" className="ml-2">
                  {token.baseToken.symbol}
                </Badge>
              </TableCell>
              <TableCell>${Number(token.priceUsd).toFixed(6)}</TableCell>
              <TableCell className={token.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}>
                {formatPercentage(token.priceChange24h)}
              </TableCell>
              <TableCell>{formatMarketCap(parseFloat(token.volume24h))}</TableCell>
              <TableCell>
                <span className={`flex items-center gap-1 ${getRiskColor(riskScore)}`}>
                  <AlertTriangle className="w-4 h-4" />
                  {getRiskLabel(riskScore)}
                </span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};