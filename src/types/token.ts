export interface TokenData {
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: string;
  volume24h: string;
  priceChange24h: number;
  liquidity: {
    usd: number;
  };
  fdv: number;
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
    };
  };
}