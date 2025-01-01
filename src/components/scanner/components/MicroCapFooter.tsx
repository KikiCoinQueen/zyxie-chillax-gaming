export const MicroCapFooter = () => {
  return (
    <div className="mt-12 text-center space-y-2">
      <p className="text-sm text-muted-foreground">
        Data provided by CoinGecko • Updated every 60 seconds
      </p>
      <p className="text-xs text-primary">
        Showing verified micro-cap coins under $100M market cap
      </p>
    </div>
  );
};