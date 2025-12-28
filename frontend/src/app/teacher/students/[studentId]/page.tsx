"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    BookOpen,
    Award,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    BarChart3,
    FileText,
    Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { useStudentDetail, useStudentCourses } from "@/hooks/teacher/useStudentManagement";
import { formatDistanceToNow } from "date-fns";

export default function StudentDetailPage({
    params,
}: {
    params: Promise<{ studentId: string }>;
}) {
    const { studentId } = use(params);
    const studentIdNum = Number(studentId);

    const { data: student, isLoading } = useStudentDetail(studentIdNum);
    const { data: studentCourses } = useStudentCourses(studentIdNum, 0, 50);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Student Not Found</h2>
                    <p className="text-slate-600 dark:text-slate-400">The student you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/teacher/students"
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Student Details</h1>
                        <p className="text-slate-600 dark:text-slate-400">View comprehensive student information</p>
                    </div>
                </div>

                {/* Student Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row gap-6 -mt-16">
                            <div className="relative w-32 h-32 rounded-xl overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl">
                                <Image
                                    src={student.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.username)}&background=6366f1&color=fff`}
                                    alt={student.username}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 mt-16 md:mt-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{student.profile?.fullName || student.username}</h2>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            Student Code: {student.profile?.studentCode || "N/A"}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <a
                                            href={`mailto:${student.email}`}
                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </a>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{student.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Phone</p>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{student.profile?.phone || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Joined</p>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                {student.profile?.createdAt ? new Date(student.profile.createdAt).toLocaleDateString() : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Courses</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                    {studentCourses?.totalItems || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                    {studentCourses?.items.filter(c => c.status === "COMPLETED").length || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Average Progress</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                    {studentCourses?.items.length
                                        ? Math.round(
                                            studentCourses.items.reduce((acc, c) => acc + (c.progress || 0), 0) / studentCourses.items.length
                                        )
                                        : 0}%
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Active Courses</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                    {studentCourses?.items.filter(c => c.status === "ACTIVE").length || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Enrolled Courses */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Enrolled Courses</h3>
                            <div className="space-y-4">
                                {!studentCourses || studentCourses.items.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500">
                                        <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                                        <p>No enrolled courses yet</p>
                                    </div>
                                ) : (
                                    studentCourses.items.map((course, index) => (
                                        <motion.div
                                            key={course.courseId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                                        >
                                            <div className="flex gap-4">
                                                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={course.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop"}
                                                        alt={course.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h4 className="font-semibold text-slate-900 dark:text-white">{course.title}</h4>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {course.status === "COMPLETED" ? (
                                                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full flex items-center gap-1">
                                                                    <CheckCircle className="w-3 h-3" />
                                                                    Completed
                                                                </span>
                                                            ) : course.status === "ACTIVE" ? (
                                                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                                                                    In Progress
                                                                </span>
                                                            ) : (
                                                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-xs font-medium rounded-full">
                                                                    {course.status}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                                        <div>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">Progress</p>
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                                {course.progress || 0}%
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                                {course.status || "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                                                            style={{ width: `${course.progress || 0}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Activity - Placeholder for future implementation */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Recent Activity
                            </h3>
                            <div className="text-center py-8 text-slate-500 text-sm">
                                Activity tracking coming soon
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Performance Summary
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Courses</span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {studentCourses?.totalItems || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Active</span>
                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        {studentCourses?.items.filter(c => c.status === "ACTIVE").length || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Completed</span>
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                        {studentCourses?.items.filter(c => c.status === "COMPLETED").length || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
