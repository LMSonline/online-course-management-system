"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ReactNode } from "react";
import {
    ArrowLeft,
    LayoutDashboard,
    FileText,
    Users,
    BarChart3,
    Settings,
    Globe,
    Lock,
    BookOpen,
    Edit,
    GraduationCap,
} from "lucide-react";
import { CourseDetailResponse } from "@/services/courses/course.types";

interface CourseManagementLayoutProps {
    course: CourseDetailResponse;
    children: ReactNode;
}

export function CourseManagementLayout({ course, children }: CourseManagementLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    const navItems = [
        {
            id: "overview",
            label: "Overview",
            icon: LayoutDashboard,
            href: `/teacher/courses/${slug}`,
            description: "Course dashboard and statistics",
        },
        {
            id: "content",
            label: "Content",
            icon: BookOpen,
            href: `/teacher/courses/${slug}/content`,
            description: "Manage chapters and lessons",
        },
        {
            id: "versions",
            label: "Versions",
            icon: FileText,
            href: `/teacher/courses/${slug}/versions`,
            description: "Version history and management",
        },
        {
            id: "students",
            label: "Students",
            icon: Users,
            href: `/teacher/courses/${slug}/students`,
            description: "Enrolled students and progress",
        },
        {
            id: "analytics",
            label: "Analytics",
            icon: BarChart3,
            href: `/teacher/courses/${slug}/analytics`,
            description: "Performance insights and metrics",
        },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            href: `/teacher/courses/${slug}/settings`,
            description: "Course configuration",
        },
    ];

    const isActive = (href: string) => {
        if (href === `/teacher/courses/${slug}`) {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left: Back button and course title */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <button
                                onClick={() => router.push("/teacher/courses")}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </button>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                                    {course.title}
                                </h1>
                                <div className="flex items-center gap-2 mt-0.5">
                                    {course.category && (
                                        <span className="text-xs text-slate-600 dark:text-slate-400">
                                            {course.category.name}
                                        </span>
                                    )}
                                    <span className="text-xs text-slate-400">•</span>
                                    <span
                                        className={`text-xs font-medium ${course.isClosed
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-emerald-600 dark:text-emerald-400"
                                            }`}
                                    >
                                        {course.isClosed ? (
                                            <span className="flex items-center gap-1">
                                                <Lock className="w-3 h-3" />
                                                Closed
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <Globe className="w-3 h-3" />
                                                Open
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Quick actions */}
                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                            <Link
                                href={`/teacher/courses/${slug}/edit`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                <span className="hidden sm:inline">Edit</span>
                            </Link>
                            <Link
                                href={`/courses/${course.slug}`}
                                target="_blank"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
                            >
                                <GraduationCap className="w-4 h-4" />
                                <span className="hidden sm:inline">View as Student</span>
                            </Link>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`group flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-all whitespace-nowrap ${active
                                        ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                                        : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700"
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${active ? "" : "group-hover:scale-110"} transition-transform`} />
                                    <span className="text-sm">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>
        </div>
    );
}
