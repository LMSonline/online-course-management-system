import Link from "next/link";
import { BookOpen, Plus, Search } from "lucide-react";

interface EmptyStateProps {
    hasSearch?: boolean;
    searchQuery?: string;
    tabType?: 'all' | 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED' | 'ARCHIVED';
}

export const EmptyState = ({ hasSearch, searchQuery, tabType = 'all' }: EmptyStateProps) => {
    const getEmptyStateContent = () => {
        if (hasSearch && searchQuery) {
            return {
                icon: <Search className="w-16 h-16 text-slate-400" />,
                title: "No courses found",
                description: `No courses match your search "${searchQuery}". Try adjusting your search terms.`,
                showButton: false
            };
        }

        switch (tabType) {
            case 'DRAFT':
                return {
                    icon: <BookOpen className="w-16 h-16 text-slate-400" />,
                    title: "No draft courses",
                    description: "You don't have any courses in draft status. Start creating your first course!",
                    showButton: true
                };
            case 'PENDING':
                return {
                    icon: <BookOpen className="w-16 h-16 text-slate-400" />,
                    title: "No pending courses",
                    description: "You don't have any courses pending review.",
                    showButton: false
                };
            case 'APPROVED':
                return {
                    icon: <BookOpen className="w-16 h-16 text-slate-400" />,
                    title: "No approved courses",
                    description: "You don't have any approved courses waiting to be published.",
                    showButton: false
                };
            case 'REJECTED':
                return {
                    icon: <BookOpen className="w-16 h-16 text-slate-400" />,
                    title: "No rejected courses",
                    description: "You don't have any rejected courses. Keep up the good work!",
                    showButton: false
                };
            case 'PUBLISHED':
                return {
                    icon: <BookOpen className="w-16 h-16 text-slate-400" />,
                    title: "No published courses",
                    description: "You haven't published any courses yet. Create and publish your first course!",
                    showButton: true
                };
            case 'ARCHIVED':
                return {
                    icon: <BookOpen className="w-16 h-16 text-slate-400" />,
                    title: "No archived courses",
                    description: "You don't have any archived courses.",
                    showButton: false
                };
            default:
                return {
                    icon: <BookOpen className="w-16 h-16 text-slate-400" />,
                    title: "No courses yet",
                    description: "Start your teaching journey by creating your first course. Share your knowledge with students around the world!",
                    showButton: true
                };
        }
    };

    const content = getEmptyStateContent();

    return (
        <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-8 mb-6">
                {content.icon}
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {content.title}
            </h3>

            <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-8">
                {content.description}
            </p>

            {content.showButton && (
                <Link
                    href="/teacher/create-course"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-600/30"
                >
                    <Plus className="w-5 h-5" />
                    Create Your First Course
                </Link>
            )}

            {hasSearch && searchQuery && (
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                    Clear search and show all courses
                </button>
            )}
        </div>
    );
};
