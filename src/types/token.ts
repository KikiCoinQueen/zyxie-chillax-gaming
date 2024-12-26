export interface TokenData {
  baseToken: {
    id: string;
    address: string;
    name: string;
    symbol: string;
    thumb?: string;
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
  baseToken: {
    id: string;
    name: string;
    symbol: string;
    thumb?: string;
  };
  priceUsd: string;
  volume24h: string;
  priceChange24h: number;
  marketCap?: number;
  rank?: number;
}