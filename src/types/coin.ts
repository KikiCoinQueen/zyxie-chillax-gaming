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
    };
  }>;
}