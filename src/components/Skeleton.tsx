export function SkeletonCard() {
  return (
    <div className="rounded-lg overflow-hidden">
      <div className="aspect-[3/4] shimmer rounded-lg" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-3/4 shimmer rounded" />
        <div className="h-3 w-1/2 shimmer rounded" />
        <div className="h-4 w-1/3 shimmer rounded" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <div className="aspect-[3/4] shimmer rounded-lg" />
      <div className="space-y-4">
        <div className="h-8 w-3/4 shimmer rounded" />
        <div className="h-6 w-1/3 shimmer rounded" />
        <div className="h-4 w-full shimmer rounded" />
        <div className="h-4 w-full shimmer rounded" />
        <div className="h-4 w-2/3 shimmer rounded" />
        <div className="h-10 w-full shimmer rounded mt-6" />
      </div>
    </div>
  );
}
