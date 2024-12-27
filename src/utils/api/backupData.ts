import { TokenData } from "@/types/token";

export const BACKUP_PAIRS: TokenData[] = [
  {
    baseToken: {
      id: "wrapped-solana",
      address: "So11111111111111111111111111111111111111112",
      name: "Wrapped SOL",
      symbol: "SOL",
      thumb: "https://assets.coingecko.com/coins/images/13162/thumb/sol.png"
    },
    priceUsd: "100.00",
    volume24h: "1000000",
    priceChange24h: 5.2,
    liquidity: { usd: 10000000 },
    fdv: 1000000,
    marketCap: 10000000,
    rank: 1,
    lastUpdated: new Date().toISOString(),
    confidence: 0.95
  },
  {
    baseToken: {
      id: "usd-coin",
      address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      name: "USD Coin",
      symbol: "USDC",
      thumb: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png"
    },
    priceUsd: "1.00",
    volume24h: "500000",
    priceChange24h: 0.1,
    liquidity: { usd: 5000000 },
    fdv: 500000,
    marketCap: 5000000,
    rank: 2,
    lastUpdated: new Date().toISOString(),
    confidence: 0.98
  },
  {
    baseToken: {
      id: "bonk",
      address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
      name: "BONK",
      symbol: "BONK",
      thumb: "https://assets.coingecko.com/coins/images/28600/thumb/bonk.jpg"
    },
    priceUsd: "0.000015",
    volume24h: "2000000",
    priceChange24h: 15.5,
    liquidity: { usd: 3000000 },
    fdv: 750000,
    marketCap: 3000000,
    rank: 3,
    lastUpdated: new Date().toISOString(),
    confidence: 0.85
  },
  {
    baseToken: {
      id: "raydium",
      address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      name: "Raydium",
      symbol: "RAY",
      thumb: "https://assets.coingecko.com/coins/images/13928/thumb/ray.png"
    },
    priceUsd: "0.50",
    volume24h: "300000",
    priceChange24h: -2.3,
    liquidity: { usd: 2000000 },
    fdv: 400000,
    marketCap: 2000000,
    rank: 4,
    lastUpdated: new Date().toISOString(),
    confidence: 0.92
  }
];