/**
 * Shimmer loading placeholder shaped like a recipe card.
 * Uses the .skeleton-shimmer utility defined in index.css.
 */
export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
      <div className="skeleton-shimmer h-44 w-full" />
      <div className="space-y-3 p-5">
        <div className="skeleton-shimmer h-5 w-3/4 rounded-full" />
        <div className="skeleton-shimmer h-4 w-1/2 rounded-full" />
        <div className="flex gap-2 pt-2">
          <div className="skeleton-shimmer h-6 w-16 rounded-full" />
          <div className="skeleton-shimmer h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 10 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default SkeletonCard;
