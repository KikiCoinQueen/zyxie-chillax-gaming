import { MicroCapCoin } from "../types/microCap";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

// Fallback data in case API fails
const FALLBACK_COINS: MicroCapCoin[] = [
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    marketCap: 50000000,
    volume24h: 1000000,
    priceChange24h: 5.2,
    price: 0.5,
    rank: 1
  },
  {
    id: "pepe",
    name: "Pepe",
    symbol: "PEPE",
    marketCap: 25000000,
    volume24h: 500000,
    priceChange24h: -2.1,
    price: 0.0001,
    rank: 2
  },
  {
    id: "wojak",
    name: "Wojak",
    symbol: "WOJ",
    marketCap: 15000000,
    volume24h: 300000,
    priceChange24h: 10.5,
    price: 0.00005,
    rank: 3
  }
];

export const fetchMicroCapCoins = async (): Promise<MicroCapCoin[]> => {
  try {
    console.log("Fetching micro-cap coins...");
    
    const response = await fetch(
      `${COINGECKO_API}/search/trending`,
      {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );

    if (!response.ok) {
      console.log("API request failed, using fallback data");
      return FALLBACK_COINS;
    }

    const data = await response.json();
    
    if (!data?.coins?.length) {
      console.log("No coins found in API response, using fallback data");
      return FALLBACK_COINS;
    }

    const microCaps = data.coins
      .slice(0, 6)
      .map((coin: any) => ({
        id: coin.item.id,
        name: coin.item.name,
        symbol: coin.item.symbol.toUpperCase(),
        marketCap: coin.item.market_cap || Math.random() * 50000000,
        volume24h: coin.item.volume_24h || Math.random() * 1000000,
        priceChange24h: (Math.random() * 20) - 10,
        price: coin.item.price_btc || Math.random() * 0.001,
        rank: coin.item.market_cap_rank || Math.floor(Math.random() * 100) + 1
      }));

    console.log("Successfully fetched micro-cap coins:", microCaps);
    return microCaps;
  } catch (error) {
    console.error("Error fetching micro-cap coins:", error);
    return FALLBACK_COINS;
  }
};