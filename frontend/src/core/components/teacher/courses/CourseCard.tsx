import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    RotateCcw,
    Users,
    DollarSign,
    Star,
    BookOpen,
    Clock,
    TrendingUp,
    MessageSquare,
    Copy,
    Share2,
    BarChart3,
    FileText
} from "lucide-react";
import { CourseResponse, Difficulty } from "@/services/courses/course.types";

interface CourseCardProps {
    course: CourseResponse;
    onToggleStatus?: (courseId: number, isClosed: boolean) => void;
    onDelete?: (courseId: number) => void;
    onRestore?: (courseId: number) => void;
}

export const CourseCard = ({ course, onToggleStatus, onDelete, onRestore }: CourseCardProps) => {
    const [showMenu, setShowMenu] = useState(false);

    // Mock data - will be replaced with real API data
    const mockStats = {
        students: Math.floor(Math.random() * 50000) + 5000,
        rating: (Math.random() * 1 + 4).toFixed(1),
        reviews: Math.floor(Math.random() * 5000) + 500,
        revenue: Math.floor(Math.random() * 100000) + 10000,
    };

    const getDifficultyColor = (difficulty?: Difficulty) => {
        switch (difficulty) {
            case 'BEGINNER':
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
            case 'INTERMEDIATE':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
            case 'ADVANCED':
                return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
            default:
                return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
        }
    };

    const getStatusBadge = (isClosed?: boolean) => {
        if (isClosed) {
            return (
                <div className="absolute top-2 right-2 px-2.5 py-1 bg-slate-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-md">
                    Closed
                </div>
            );
        }
        return (
            <div className="absolute top-2 right-2 px-2.5 py-1 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-md">
                Published
            </div>
        );
    };

    const handleToggleStatus = () => {
        if (onToggleStatus) {
            onToggleStatus(course.id, !course.isClosed);
        }
        setShowMenu(false);
    };

    const handleDelete = () => {
        if (onDelete && window.confirm('Are you sure you want to delete this course?')) {
            onDelete(course.id);
        }
        setShowMenu(false);
    };

    const handleRestore = () => {
        if (onRestore) {
            onRestore(course.id);
        }
        setShowMenu(false);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/courses/${course.slug}`);
        alert('Course link copied to clipboard!');
        setShowMenu(false);
    };

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(num);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 overflow-hidden group hover:shadow-xl hover:shadow-indigo-500/10">
            <div className="flex flex-col sm:flex-row gap-0">
                {/* Thumbnail */}
                <div className="relative w-full sm:w-72 h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                    {course.thumbnailUrl ? (
                        <Image
                            src={course.thumbnailUrl}
                            alt={course.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 288px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-indigo-400/50" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Status Badge */}
                    {getStatusBadge(course.isClosed)}

                    {/* Difficulty Badge */}
                    {course.difficulty && (
                        <div className={`absolute bottom-2 left-2 px-2.5 py-1 rounded-md text-xs font-semibold border backdrop-blur-md ${getDifficultyColor(course.difficulty)}`}>
                            {course.difficulty}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 pr-4">
                            <Link
                                href={`/teacher/courses/${course.slug}`}
                                className="text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2 leading-tight"
                            >
                                {course.title}
                            </Link>
                            {course.categoryName && (
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md text-xs font-medium border border-indigo-500/20">
                                        {course.categoryName}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Actions Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </button>

                            {showMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-20 py-1.5 overflow-hidden">
                                        <Link
                                            href={`/teacher/courses/${course.slug}`}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Course
                                        </Link>

                                        <Link
                                            href={`/teacher/courses/${course.slug}/edit`}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit Course
                                        </Link>

                                        <Link
                                            href={`/teacher/courses/${course.slug}/analytics`}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                            Analytics
                                        </Link>

                                        <Link
                                            href={`/teacher/courses/${course.slug}/stats`}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                            Statistics
                                        </Link>

                                        <Link
                                            href={`/teacher/courses/${course.slug}/students`}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            <Users className="w-4 h-4" />
                                            Students
                                        </Link>

                                        <button
                                            onClick={handleCopyLink}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors w-full text-left"
                                        >
                                            <Copy className="w-4 h-4" />
                                            Copy Link
                                        </button>

                                        <hr className="my-1.5 border-slate-200 dark:border-slate-700" />

                                        <button
                                            onClick={handleToggleStatus}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors w-full text-left"
                                        >
                                            {course.isClosed ? (
                                                <>
                                                    <Eye className="w-4 h-4" />
                                                    Open Course
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="w-4 h-4" />
                                                    Close Course
                                                </>
                                            )}
                                        </button>

                                        <hr className="my-1.5 border-slate-200 dark:border-slate-700" />

                                        <button
                                            onClick={handleDelete}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full text-left"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete Course
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Students</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{formatNumber(mockStats.students)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Rating</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{mockStats.rating}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Revenue</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(mockStats.revenue)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Reviews</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{formatNumber(mockStats.reviews)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <Link
                            href={`/teacher/courses/${course.slug}`}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            View
                        </Link>
                        <Link
                            href={`/teacher/courses/${course.slug}/edit`}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-600/30"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
