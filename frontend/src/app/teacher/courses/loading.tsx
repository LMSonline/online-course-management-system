import { CardGridSkeleton } from "@/core/components/teacher/skeletons";

export default function CoursesLoading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
                    <div className="space-y-2">
                        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-48"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-80 max-w-full"></div>
                    </div>
                    <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-40"></div>
                </div>

                <CardGridSkeleton count={6} />
            </div>
        </div>
    );
}
