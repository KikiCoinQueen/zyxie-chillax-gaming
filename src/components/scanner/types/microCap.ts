export interface MicroCapCoin {
  id: string;
  name: string;
  symbol: string;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  price: number;
  rank?: number;
}