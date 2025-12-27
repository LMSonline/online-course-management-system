import { TableSkeleton } from "@/core/components/teacher/skeletons";

export default function AssignmentsLoading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
                <div className="space-y-2">
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-64"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-96 max-w-full"></div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
                            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
                        </div>
                    ))}
                </div>

                <TableSkeleton rows={8} />
            </div>
        </div>
    );
}
