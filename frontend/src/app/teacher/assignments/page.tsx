"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import {
    Search,
    Plus,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    Eye,
    Edit,
    Calendar,
    Users,
    Filter,
    Download,
} from "lucide-react";
import { courseService } from "@/services/courses";
import { assignmentService } from "@/services/assignment";
import type { AssignmentResponse } from "@/services/assignment";

export default function TeacherAssignmentsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Closed">("all");
    const [courseFilter, setCourseFilter] = useState<number | "all">("all");

    const { data: courses } = useQuery({
        queryKey: ["teacher-courses"],
        queryFn: () => courseService.getMyCourses(0, 100),
    });

    const assignments = useMemo(() => {
        const mockData: Array<AssignmentResponse & {
            course: string;
            daysOverdue?: number;
            submissions: number;
            totalStudents: number;
            pending: number;
            avgScore: number;
            displayStatus: string;
        }> = [
                {
                    id: 1,
                    title: "Responsive Design Project",
                    course: "Complete Web Development Bootcamp",
                    dueDate: "2024-11-15",
                    daysOverdue: 381,
                    submissions: 45,
                    totalStudents: 52,
                    pending: 11,
                    avgScore: 87,
                    displayStatus: "Active",
                    lessonId: 1,
                    allowLateSubmission: true,
                    status: "PUBLISHED",
                    createdAt: "2024-10-20",
                    updatedAt: "2024-10-20",
                    totalSubmissions: 45,
                    gradedSubmissions: 34,
                },
                {
                    id: 2,
                    title: "JavaScript DOM Manipulation",
                    course: "Complete Web Development Bootcamp",
                    dueDate: "2024-11-20",
                    daysOverdue: 353,
                    submissions: 23,
                    totalStudents: 23,
                    pending: 0,
                    avgScore: 92,
                    displayStatus: "Closed",
                    lessonId: 2,
                    allowLateSubmission: false,
                    status: "PUBLISHED",
                    createdAt: "2024-10-15",
                    updatedAt: "2024-10-15",
                    totalSubmissions: 23,
                    gradedSubmissions: 23,
                },
                {
                    id: 3,
                    title: "React Component Library",
                    course: "Advanced React Patterns",
                    dueDate: "2024-11-25",
                    daysOverdue: 21,
                    submissions: 15,
                    totalStudents: 20,
                    pending: 5,
                    avgScore: 88,
                    displayStatus: "Active",
                    lessonId: 3,
                    allowLateSubmission: true,
                    status: "PUBLISHED",
                    createdAt: "2024-11-10",
                    updatedAt: "2024-11-10",
                    totalSubmissions: 15,
                    gradedSubmissions: 10,
                },
            ];

        return mockData;
    }, []);

    const filteredAssignments = useMemo(() => {
        return assignments.filter((assignment) => {
            const matchesSearch =
                searchQuery === "" ||
                assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                assignment.course.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || assignment.displayStatus === statusFilter;

            const matchesCourse =
                courseFilter === "all" || assignment.courseId === courseFilter;

            return matchesSearch && matchesStatus && matchesCourse;
        });
    }, [assignments, searchQuery, statusFilter, courseFilter]);

    const stats = useMemo(() => {
        const total = assignments.length;
        const active = assignments.filter((a) => a.displayStatus === "Active").length;
        const totalSubmissions = assignments.reduce((sum, a) => sum + a.submissions, 0);
        const totalPending = assignments.reduce((sum, a) => sum + a.pending, 0);

        return { total, active, totalSubmissions, totalPending };
    }, [assignments]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Assignments</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Manage and grade student assignments
                        </p>
                    </div>
                    <Link
                        href="/teacher/assignments/create"
                        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
                    >
                        <Plus className="w-4 h-4" />
                        Create Assignment
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Total Assignments
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Active
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.active}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Total Submissions
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalSubmissions}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Pending Review
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalPending}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search assignments..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <select
                                value={courseFilter}
                                onChange={(e) => setCourseFilter(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                                className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="all">All Courses</option>
                                {courses?.items.map((course: any) => (
                                    <option key={course.id} value={course.id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                                className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="all">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Assignment
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Submissions
                                    </th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Avg Score
                                    </th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {filteredAssignments.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                            No assignments found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAssignments.map((assignment) => {
                                        const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
                                        const isOverdue = dueDate && dueDate < new Date();

                                        return (
                                            <tr
                                                key={assignment.id}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                                            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900 dark:text-white text-sm">
                                                                {assignment.title}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                {assignment.pending} pending review
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                        {assignment.courseTitle || assignment.course}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        <span className={`text-sm ${isOverdue ? "text-red-600 dark:text-red-400" : "text-slate-600 dark:text-slate-400"}`}>
                                                            {dueDate ? dueDate.toLocaleDateString() : "No due date"}
                                                        </span>
                                                    </div>
                                                    {isOverdue && assignment.daysOverdue && (
                                                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                            {assignment.daysOverdue} days overdue
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {assignment.submissions}/{assignment.totalStudents}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {assignment.avgScore}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${assignment.displayStatus === "Active"
                                                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                                            }`}
                                                    >
                                                        {assignment.displayStatus === "Active" ? (
                                                            <CheckCircle2 className="w-3 h-3" />
                                                        ) : (
                                                            <AlertCircle className="w-3 h-3" />
                                                        )}
                                                        {assignment.displayStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={`/teacher/assignments/${assignment.id}`}
                                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                        </Link>
                                                        <Link
                                                            href={`/teacher/assignments/${assignment.id}/edit`}
                                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
