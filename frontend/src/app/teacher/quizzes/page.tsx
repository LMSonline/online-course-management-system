"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { assessmentService } from "@/services/assessment/assessment.service";
import { QuizResponse, QuizStatus } from "@/services/assessment/assessment.types";
import { useTeacherId } from "@/hooks/useProfile";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    BarChart3,
    Clock,
    Target,
    Trophy,
    FileText,
    Filter,
} from "lucide-react";

export default function TeacherQuizzesPage() {
    const router = useRouter();
    const teacherId = useTeacherId();
    const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<QuizStatus | "ALL">("ALL");

    useEffect(() => {
        if (teacherId) {
            loadQuizzes();
        }
    }, [teacherId]);

    const loadQuizzes = async () => {
        if (!teacherId) return;

        try {
            setLoading(true);
            // This would need an API endpoint to get all quizzes for a teacher
            // For now, this is a placeholder
            // const data = await assessmentService.getQuizzesByTeacher(teacherId);
            setQuizzes([]);
        } catch (error) {
            console.error("Failed to load quizzes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateQuiz = () => {
        router.push("/teacher/quizzes/create");
    };

    const handleEditQuiz = (quizId: number) => {
        router.push(`/teacher/quizzes/${quizId}/edit`);
    };

    const handleViewResults = (quizId: number) => {
        router.push(`/teacher/quizzes/${quizId}/results`);
    };

    const handleDeleteQuiz = async (id: number) => {
        if (!confirm("Are you sure you want to delete this quiz?")) return;

        try {
            await assessmentService.deleteQuiz(id);
            setQuizzes(quizzes.filter((q) => q.id !== id));
        } catch (error) {
            console.error("Failed to delete quiz:", error);
        }
    };

    const filteredQuizzes = quizzes.filter((quiz) => {
        const matchesSearch = quiz.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "ALL" || quiz.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: QuizStatus) => {
        const colors = {
            DRAFT: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
            PUBLISHED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
            ARCHIVED: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
        };
        return colors[status];
    };

    const getTypeColor = (type: string) => {
        const colors = {
            PRACTICE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            GRADED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
            FINAL: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        };
        return colors[type as keyof typeof colors] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Quiz Management</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Create and manage quizzes using your question banks
                        </p>
                    </div>
                    <button
                        onClick={handleCreateQuiz}
                        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
                    >
                        <Plus className="w-4 h-4" />
                        Create Quiz
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search quizzes..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as QuizStatus | "ALL")}
                        className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="ALL">All Status</option>
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>
                </div>
                {filteredQuizzes.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                        <FileText className="mx-auto w-12 h-12 text-slate-400" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No quizzes</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            {searchTerm || filterStatus !== "ALL"
                                ? "No quizzes match your search criteria"
                                : "Get started by creating your first quiz"}
                        </p>
                        {!searchTerm && filterStatus === "ALL" && (
                            <button
                                onClick={handleCreateQuiz}
                                className="mt-6 flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg mx-auto"
                            >
                                <Plus className="w-4 h-4" />
                                Create Quiz
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredQuizzes.map((quiz) => (
                            <div
                                key={quiz.id}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                    {quiz.title}
                                                </h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                        quiz.status
                                                    )}`}
                                                >
                                                    {quiz.status}
                                                </span>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                                                        quiz.quizType
                                                    )}`}
                                                >
                                                    {quiz.quizType}
                                                </span>
                                            </div>
                                            {quiz.description && (
                                                <p className="text-sm text-gray-500 mb-3">
                                                    {quiz.description}
                                                </p>
                                            )}
                                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                                                {quiz.lessonTitle && (
                                                    <span className="flex items-center">
                                                        <FileText className="h-4 w-4 mr-1" />
                                                        {quiz.lessonTitle}
                                                    </span>
                                                )}
                                                {quiz.totalQuestions !== undefined && (
                                                    <span className="flex items-center">
                                                        <Target className="h-4 w-4 mr-1" />
                                                        {quiz.totalQuestions} questions
                                                    </span>
                                                )}
                                                {quiz.timeLimit && (
                                                    <span className="flex items-center">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        {quiz.timeLimit} min
                                                    </span>
                                                )}
                                                {quiz.passingScore !== undefined && (
                                                    <span className="flex items-center">
                                                        <Trophy className="h-4 w-4 mr-1" />
                                                        {quiz.passingScore}% to pass
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            <button
                                                onClick={() => handleViewResults(quiz.id)}
                                                className="p-2 text-gray-400 hover:text-blue-600 rounded-md transition-colors"
                                                title="View Results"
                                            >
                                                <BarChart3 className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleEditQuiz(quiz.id)}
                                                className="p-2 text-gray-400 hover:text-purple-600 rounded-md transition-colors"
                                                title="Edit Quiz"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteQuiz(quiz.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 rounded-md transition-colors"
                                                title="Delete Quiz"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
