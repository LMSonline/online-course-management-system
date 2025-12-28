export function PageLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6 animate-pulse">
                {/* Header */}
                <div className="space-y-2">
                    <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-lg w-64"></div>
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-96"></div>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function ListLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6 animate-pulse">
                {/* Header with button */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-lg w-64"></div>
                        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-80"></div>
                    </div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-32"></div>
                </div>

                {/* List items */}
                <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-3">
                                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/5"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5"></div>
                                    <div className="flex gap-2">
                                        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20"></div>
                                        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-16"></div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                    <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function TableLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6 animate-pulse">
                {/* Header */}
                <div className="space-y-2">
                    <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-lg w-64"></div>
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-80"></div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
                    {/* Table header */}
                    <div className="border-b border-slate-200 dark:border-slate-800 p-4">
                        <div className="grid grid-cols-5 gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                            ))}
                        </div>
                    </div>
                    {/* Table rows */}
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="border-b border-slate-200 dark:border-slate-800 p-4">
                            <div className="grid grid-cols-5 gap-4">
                                {[...Array(5)].map((_, j) => (
                                    <div key={j} className="h-5 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
