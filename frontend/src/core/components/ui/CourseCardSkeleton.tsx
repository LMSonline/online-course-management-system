/**
 * Simple skeleton for course card (public pages)
 */
export function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/[0.06] overflow-hidden animate-pulse">
      <div className="relative aspect-[16/9] bg-slate-200 dark:bg-slate-700" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
      </div>
    </div>
  );
}

export function CourseCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

