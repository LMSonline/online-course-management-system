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
            DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
            PUBLISHED: "bg-green-100 text-green-700 border-green-200",
            ARCHIVED: "bg-yellow-100 text-yellow-700 border-yellow-200",
        };
        return colors[status];
    };

    const getTypeColor = (type: string) => {
        const colors = {
            PRACTICE: "bg-blue-100 text-blue-700",
            GRADED: "bg-purple-100 text-purple-700",
            FINAL: "bg-red-100 text-red-700",
        };
        return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-700";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Create and manage quizzes using your question banks
                            </p>
                        </div>
                        <button
                            onClick={handleCreateQuiz}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Create Quiz
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search quizzes..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        >
                            <option value="ALL">All Status</option>
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filteredQuizzes.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No quizzes</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || filterStatus !== "ALL"
                                ? "No quizzes match your search criteria"
                                : "Get started by creating your first quiz"}
                        </p>
                        {!searchTerm && filterStatus === "ALL" && (
                            <div className="mt-6">
                                <button
                                    onClick={handleCreateQuiz}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Create Quiz
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredQuizzes.map((quiz) => (
                            <div
                                key={quiz.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
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
