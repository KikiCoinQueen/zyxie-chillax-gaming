export interface OpportunityScore {
  volumeScore: number;
  socialScore: number;
  priceScore: number;
  total: number;
}

export interface TokenOpportunity {
  baseToken: {
    address: string;
    symbol: string;
  };
  priceChange24h: number;
  volume24h: string;
  fdv: number;
  opportunityScore: OpportunityScore;
}