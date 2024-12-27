import { Skeleton } from "../ui/skeleton";

export const MarketLoading = () => {
  return (
    <>
      <div className="flex items-center justify-center gap-3 mb-12">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-6" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] w-full" />
        ))}
      </div>
    </>
  );
};