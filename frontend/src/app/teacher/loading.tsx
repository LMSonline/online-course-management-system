export default function TeacherLoading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 animate-pulse">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="space-y-2">
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-64"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-96"></div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
                            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
                        </div>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-40"></div>
                            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-48"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
