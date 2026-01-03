"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
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

// Mock API call - replace with real service
const fetchStudentDetail = async (studentId: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        id: studentId,
        name: "John Davis",
        email: "john.d@example.com",
        phone: "+1 (555) 123-4567",
        avatar: "https://ui-avatars.com/api/?name=John+Davis&background=6366f1&color=fff",
        studentCode: "STD-2024-001",
        joinedDate: "Jan 15, 2024",
        totalCourses: 3,
        completedCourses: 1,
        inProgressCourses: 2,
        totalAssignments: 15,
        submittedAssignments: 12,
        averageGrade: 8.5,
        enrolledCourses: [
            {
                id: 1,
                title: "Complete Web Development Bootcamp",
                thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
                progress: 45,
                enrolledDate: "Jan 15, 2024",
                status: "in-progress",
                grade: null,
                completionRate: 45,
                assignmentsCompleted: 5,
                totalAssignments: 10,
                quizzesTaken: 8,
                totalQuizzes: 12,
                lastActive: "2 hours ago",
            },
            {
                id: 2,
                title: "Advanced React Patterns",
                thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
                progress: 89,
                enrolledDate: "Feb 10, 2024",
                status: "in-progress",
                grade: null,
                completionRate: 89,
                assignmentsCompleted: 4,
                totalAssignments: 5,
                quizzesTaken: 10,
                totalQuizzes: 10,
                lastActive: "1 day ago",
            },
            {
                id: 3,
                title: "Node.js Backend Development",
                thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop",
                progress: 100,
                enrolledDate: "Dec 5, 2023",
                status: "completed",
                grade: 9.2,
                completionRate: 100,
                assignmentsCompleted: 8,
                totalAssignments: 8,
                quizzesTaken: 12,
                totalQuizzes: 12,
                lastActive: "3 weeks ago",
                completedDate: "Mar 20, 2024",
                certificateIssued: true,
            },
        ],
        recentActivity: [
            { type: "assignment", title: "Submitted Assignment: React Hooks Deep Dive", time: "2 hours ago" },
            { type: "quiz", title: "Completed Quiz: State Management", score: 85, time: "5 hours ago" },
            { type: "lesson", title: "Watched: Advanced Context API", time: "1 day ago" },
            { type: "assignment", title: "Submitted Assignment: Custom Hooks Project", time: "2 days ago" },
        ],
        quizResults: [
            { title: "Introduction to React", score: 90, maxScore: 100, date: "Mar 15, 2024" },
            { title: "State Management", score: 85, maxScore: 100, date: "Mar 20, 2024" },
            { title: "React Router", score: 95, maxScore: 100, date: "Mar 25, 2024" },
        ],
    };
};

export default function StudentDetailPage({
    params,
}: {
    params: Promise<{ studentId: string }>;
}) {
    const { studentId } = use(params);

    const { data: student, isLoading } = useQuery({
        queryKey: ["student", studentId],
        queryFn: () => fetchStudentDetail(studentId),
    });

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
                                    src={student.avatar}
                                    alt={student.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 mt-16 md:mt-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{student.name}</h2>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            Student Code: {student.studentCode}
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
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{student.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Joined</p>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{student.joinedDate}</p>
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
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{student.totalCourses}</p>
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
                                    {student.completedCourses}
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
                                <p className="text-sm text-slate-600 dark:text-slate-400">Average Grade</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{student.averageGrade}</p>
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
                                <p className="text-sm text-slate-600 dark:text-slate-400">Assignments</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                    {student.submittedAssignments}/{student.totalAssignments}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
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
                                {student.enrolledCourses.map((course, index) => (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                                    >
                                        <div className="flex gap-4">
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={course.thumbnail}
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
                                                            Enrolled: {course.enrolledDate}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {course.status === "completed" ? (
                                                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full flex items-center gap-1">
                                                                <CheckCircle className="w-3 h-3" />
                                                                Completed
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                                                                In Progress
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4 mb-3">
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">Progress</p>
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {course.progress}%
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">Assignments</p>
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {course.assignmentsCompleted}/{course.totalAssignments}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">Quizzes</p>
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {course.quizzesTaken}/{course.totalQuizzes}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                                                        style={{ width: `${course.progress}%` }}
                                                    />
                                                </div>

                                                {course.grade && (
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <Award className="w-4 h-4 text-yellow-500" />
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            Grade: {course.grade}/10
                                                        </span>
                                                        {course.certificateIssued && (
                                                            <span className="text-xs text-green-600 dark:text-green-400">• Certificate Issued</span>
                                                        )}
                                                    </div>
                                                )}

                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                                    Last active: {course.lastActive}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Recent Activity
                            </h3>
                            <div className="space-y-4">
                                {student.recentActivity.map((activity, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {activity.type === "assignment" && <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                                            {activity.type === "quiz" && <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                                            {activity.type === "lesson" && <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-900 dark:text-white">{activity.title}</p>
                                            {"score" in activity && (
                                                <p className="text-xs text-green-600 dark:text-green-400">Score: {activity.score}%</p>
                                            )}
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quiz Results */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Recent Quiz Results
                            </h3>
                            <div className="space-y-3">
                                {student.quizResults.map((quiz, index) => (
                                    <div key={index} className="border-b border-slate-200 dark:border-slate-700 last:border-0 pb-3 last:pb-0">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{quiz.title}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{quiz.date}</p>
                                            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                                {quiz.score}/{quiz.maxScore}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
