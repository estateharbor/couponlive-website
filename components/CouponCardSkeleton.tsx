// Matches CouponCard's footprint to avoid layout shift while data loads.
export function CouponCardSkeleton() {
  return (
    <div className="surface border border-token rounded-xl p-4 sm:p-5" aria-hidden>
      <div className="flex items-start gap-3">
        <div className="skeleton rounded-lg" style={{ width: 44, height: 44 }} />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-6 w-32 rounded" />
        </div>
      </div>
      <div className="skeleton h-3 w-full rounded mt-3" />
      <div className="skeleton h-3 w-2/3 rounded mt-2" />
      <div className="skeleton h-1.5 w-full rounded-full mt-4" />
      <div className="skeleton h-11 w-full rounded-lg mt-4" />
      <div className="skeleton h-3 w-40 rounded mt-4" />
    </div>
  );
}

export function CouponGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CouponCardSkeleton key={i} />
      ))}
    </div>
  );
}
