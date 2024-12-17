import { TokenData } from "@/types/token";

export const BACKUP_PAIRS: TokenData[] = [
  {
    baseToken: {
      address: "So11111111111111111111111111111111111111112",
      name: "Wrapped SOL",
      symbol: "SOL"
    },
    priceUsd: "100.00",
    volume24h: "1000000",
    priceChange24h: 5.2,
    liquidity: { usd: 10000000 },
    fdv: 1000000
  },
  {
    baseToken: {
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      name: "USD Coin",
      symbol: "USDC"
    },
    priceUsd: "1.00",
    volume24h: "500000",
    priceChange24h: 0.1,
    liquidity: { usd: 5000000 },
    fdv: 500000
  },
  {
    baseToken: {
      address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
      name: "BONK",
      symbol: "BONK"
    },
    priceUsd: "0.000015",
    volume24h: "2000000",
    priceChange24h: 15.5,
    liquidity: { usd: 3000000 },
    fdv: 750000
  }
];