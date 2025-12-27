import Link from "next/link";
import {
    Plus,
    Upload,
    FileText,
    Settings,
    BarChart3,
    Users,
    MessageSquare,
    Download
} from "lucide-react";

export const QuickActions = () => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link
                    href="/teacher/create-course"
                    className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 rounded-xl border border-indigo-200 dark:border-indigo-800 transition-all group"
                >
                    <div className="p-3 bg-indigo-600 text-white rounded-lg group-hover:scale-110 transition-transform">
                        <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">New Course</span>
                </Link>

                <Link
                    href="/teacher/courses/import"
                    className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-all group"
                >
                    <div className="p-3 bg-emerald-600 text-white rounded-lg group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Import</span>
                </Link>

                <Link
                    href="/teacher/analytics"
                    className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 rounded-xl border border-amber-200 dark:border-amber-800 transition-all group"
                >
                    <div className="p-3 bg-amber-600 text-white rounded-lg group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Analytics</span>
                </Link>

                <Link
                    href="/teacher/students"
                    className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 rounded-xl border border-blue-200 dark:border-blue-800 transition-all group"
                >
                    <div className="p-3 bg-blue-600 text-white rounded-lg group-hover:scale-110 transition-transform">
                        <Users className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Students</span>
                </Link>
            </div>
        </div>
    );
};
