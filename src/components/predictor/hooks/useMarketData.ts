import { useQuery } from "@tanstack/react-query";

export const useMarketData = () => {
  return useQuery({
    queryKey: ["memeMarketData"],
    queryFn: async () => {
      const response = await fetch("https://api.dexscreener.com/latest/dex/tokens/SOL");
      if (!response.ok) throw new Error("Failed to fetch market data");
      const data = await response.json();
      return data.pairs?.filter((pair: any) => 
        parseFloat(pair.volume24h) > 1000 && 
        parseFloat(pair.fdv) < 10000000
      ).slice(0, 5);
    },
    refetchInterval: 30000
  });
};