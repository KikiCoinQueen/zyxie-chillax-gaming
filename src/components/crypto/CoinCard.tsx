import { Card, CardContent } from "@/components/ui/card";
import { CoinCardHeader } from "./card/CardHeader";
import { CardMetrics } from "./card/CardMetrics";
import { motion, AnimatePresence } from "framer-motion";

interface CoinData {
  price_change_percentage_24h?: number;
  market_cap?: number;
  total_volume?: number;
  sentiment_votes_up_percentage?: number;
  community_score?: number;
}

interface CoinCardProps {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  price_btc: number;
  data: CoinData;
}

export const CoinCard = (props: CoinCardProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        className="glass-card rounded-xl overflow-hidden relative group"
      >
        <Card className="border-0 bg-transparent h-full">
          <CoinCardHeader
            id={props.id}
            name={props.name}
            symbol={props.symbol}
            market_cap_rank={props.market_cap_rank}
            thumb={props.thumb}
          />
          <CardContent>
            <CardMetrics
              price_btc={props.price_btc}
              data={props.data}
            />
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};