import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Brain, Sparkles, TrendingUp, TrendingDown, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface PriceData {
  timestamp: number;
  price: number;
  sentiment: number;
}

export const CryptoPulse = () => {
  const { data: priceData, isLoading } = useQuery({
    queryKey: ["cryptoPulse"],
    queryFn: async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=2"
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("CoinGecko API Error:", errorData);
          throw new Error(errorData.status?.error_message || "Failed to fetch price data");
        }
        
        const data = await response.json();
        
        // Take last 24 data points for a day's worth of data
        const last24Hours = data.prices.slice(-24);
        
        return last24Hours.map((price: [number, number], index: number) => ({
          timestamp: price[0],
          price: price[1],
          sentiment: Math.sin(index / 3) * 50 + 50 // Simulated sentiment data
        }));
      } catch (error) {
        console.error("Error fetching price data:", error);
        toast.error("Failed to fetch price data");
        return [];
      }
    },
    refetchInterval: 60000 // Refresh every minute
  });

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 rounded-lg">
          <p className="text-sm font-bold">
            Time: {formatTime(payload[0].payload.timestamp)}
          </p>
          <p className="text-sm">
            Price: ${payload[0].value.toFixed(2)}
          </p>
          <p className="text-sm">
            Sentiment: {payload[1].value.toFixed(0)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="py-20 px-4" id="crypto-pulse">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-12">
            <Brain className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-display font-bold gradient-text text-center">
              Crypto Pulse
            </h2>
            <Heart className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <Card className="glass-card overflow-hidden">
            <CardHeader>
              <CardTitle className="text-center">SOL Price & Sentiment</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={priceData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={formatTime}
                        stroke="#888"
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#888"
                        tickFormatter={(value) => `$${value.toFixed(2)}`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#888"
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="sentiment"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="mt-6 flex justify-center gap-8">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Price</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-muted-foreground">Sentiment</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Updated every minute • Powered by CoinGecko
          </div>
        </motion.div>
      </div>
    </section>
  );
};