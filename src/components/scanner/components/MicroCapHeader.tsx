export const MicroCapHeader = () => {
  return (
    <div className="text-center mb-12 space-y-4">
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Scanning for genuine micro-cap opportunities under $100M market cap with 
        verified data from CoinGecko
      </p>
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-green-500">●</span>
        <span>Live market data</span>
        <span className="text-primary">●</span>
        <span>Verified market caps</span>
        <span className="text-yellow-500">●</span>
        <span>Real-time monitoring</span>
      </div>
    </div>
  );
};