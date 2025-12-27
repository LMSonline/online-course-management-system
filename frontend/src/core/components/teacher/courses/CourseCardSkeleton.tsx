export const CourseCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse">
            <div className="flex flex-col md:flex-row gap-6 p-6">
                {/* Thumbnail Skeleton */}
                <div className="relative w-full md:w-64 h-40 flex-shrink-0 rounded-lg bg-slate-200 dark:bg-slate-700" />

                {/* Content Skeleton */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 space-y-3">
                                {/* Title */}
                                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                                {/* Description */}
                                <div className="space-y-2">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                                </div>
                            </div>

                            {/* Menu button */}
                            <div className="ml-4 w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 mt-4">
                            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
                            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>

                        <div className="ml-auto">
                            <div className="w-20 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CourseCardSkeletonList = ({ count = 3 }: { count?: number }) => {
    return (
        <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <CourseCardSkeleton key={index} />
            ))}
        </div>
    );
};
