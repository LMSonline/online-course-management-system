
export function StatCardSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-3 animate-pulse">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-pulse">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-40"></div>
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-pulse">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-48"></div>
            <div className="space-y-3">
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="h-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                ))}
            </div>
        </div>
    );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
                    <div className="h-48 bg-slate-200 dark:bg-slate-800"></div>
                    <div className="p-6 space-y-3">
                        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                        <div className="flex gap-2 mt-4">
                            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
                            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function PageHeaderSkeleton() {
    return (
        <div className="space-y-2 animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-64"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-96 max-w-full"></div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <PageHeaderSkeleton />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <StatCardSkeleton key={i} />
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <ChartSkeleton />
                    <ChartSkeleton />
                </div>

                <TableSkeleton />
            </div>
        </div>
    );
}
