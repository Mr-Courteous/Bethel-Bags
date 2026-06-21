export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-5 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3 mt-3" />
      </div>
    </div>
  );
}

export function PageHeroSkeleton() {
  return (
    <div className="bg-empire-black py-24 animate-pulse">
      <div className="container-max px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="h-3 w-24 bg-white/10 rounded" />
        <div className="h-10 w-96 bg-white/10 rounded" />
        <div className="h-4 w-64 bg-white/10 rounded" />
      </div>
    </div>
  );
}
