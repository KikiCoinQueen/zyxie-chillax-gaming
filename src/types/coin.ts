export interface CoinDetails {
  market_data?: {
    market_cap?: {
      usd?: number;
    };
    price_change_percentage_24h?: number;
    total_volume?: {
      usd?: number;
    };
  };
  community_data?: {
    twitter_followers?: number;
    telegram_channel_user_count?: number;
  };
  developer_data?: {
    stars?: number;
  };
  links?: {
    twitter_screen_name?: string;
  };
  genesis_date?: string;
  id?: string;
  description?: {
    en?: string;
  };
  categories?: string[];
}

export interface CoinGeckoResponse {
  coins: Array<{
    item: {
      id: string;
      thumb: string;
      name: string;
      symbol: string;
      market_cap_rank?: number;
      price_btc?: number;
      data?: {
        price_change_percentage_24h?: number;
        market_cap?: number;
        total_volume?: number;
      };
    };
  }>;
}

export interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    price_btc: number;
    data: {
      price_change_percentage_24h?: number;
      market_cap?: number;
      total_volume?: number;
      sentiment_votes_up_percentage?: number;
      community_score?: number;
    };
  };
}

export interface EnhancedTrendingCoin {
  item: TrendingCoin['item'];
  analysis?: any;
  detailedData?: CoinDetails;
}
