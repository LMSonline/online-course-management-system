"use client";

import { useState } from "react";
import { useTeacherCourses } from "@/hooks/teacher/useTeacherCourses";
import {
    useUnansweredQuestions,
    usePopularComments,
    useSearchComments,
    useCommentStatistics
} from "@/hooks/teacher";
import { CommentResponse } from "@/services/community/comment/comment.types";
import { Search, MessageCircle, Clock, TrendingUp } from "lucide-react";
import { QuestionCard, ReplyDialog, ReportDialog } from "@/core/components/teacher/qna";
import Input from "@/core/components/ui/Input";
import { mockQuestions, mockQnAStats, mockCourses } from "@/lib/teacher/mockData";

export default function QnAPage() {
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<"unanswered" | "all" | "popular">("unanswered");
    const [keyword, setKeyword] = useState("");
    const [selectedComment, setSelectedComment] = useState<CommentResponse | null>(null);
    const [reportingComment, setReportingComment] = useState<number | null>(null);

    // Fetch courses
    const teacherCoursesHook = useTeacherCourses();
    const apiCourses = teacherCoursesHook.courses || [];
    // Use mock courses as fallback
    const courses = apiCourses.length > 0 ? apiCourses : mockCourses;

    // Fetch questions based on active tab
    const { data: unansweredData, isLoading: loadingUnanswered } = useUnansweredQuestions(
        activeTab === "unanswered" ? selectedCourseId : null
    );
    const { data: popularData, isLoading: loadingPopular } = usePopularComments(
        activeTab === "popular" ? selectedCourseId : null,
        20
    );
    const { data: searchData, isLoading: loadingSearch } = useSearchComments(
        selectedCourseId,
        keyword
    );

    // Fetch statistics
    const { data: apiStats } = useCommentStatistics(selectedCourseId);
    // Use mock stats as fallback
    const stats = apiStats || mockQnAStats;

    // Determine which data to show - use mock data as fallback
    const getQuestionsData = () => {
        if (keyword.trim()) return searchData;
        if (activeTab === "unanswered") return unansweredData;
        if (activeTab === "popular") return popularData;
        return [];
    };

    const apiQuestions = getQuestionsData();
    // Use mock questions as fallback when no API data
    // Note: Mock questions don't have courseId filter since CommentResponse doesn't include course info
    const questions = (apiQuestions && apiQuestions.length > 0) ? apiQuestions : mockQuestions;

    const isLoading = keyword.trim()
        ? loadingSearch
        : activeTab === "unanswered"
            ? loadingUnanswered
            : activeTab === "popular"
                ? loadingPopular
                : false;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Q&A Dashboard</h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage student questions and discussions</p>
                </div>

                {/* Statistics Cards */}
                {selectedCourseId && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Questions</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalQuestions || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Pending Reply</p>
                                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.unansweredQuestions || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Response Rate</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {stats.responseRate ? `${Math.round(stats.responseRate)}%` : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Avg Response Time</p>
                                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {stats.averageResponseTimeHours ? `${stats.averageResponseTimeHours.toFixed(1)}h` : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-12 gap-6">
                    {/* Sidebar Filters */}
                    <div className="col-span-12 lg:col-span-3">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sticky top-6 shadow-lg">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Filters</h3>

                            {/* Course Selector */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Course</label>
                                <select
                                    value={selectedCourseId || ""}
                                    onChange={(e) => setSelectedCourseId(e.target.value ? Number(e.target.value) : null)}
                                    className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Courses</option>
                                    {courses.map((course: any) => (
                                        <option key={course.id} value={course.id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tab Filter */}
                            <div className="space-y-2">
                                <button
                                    onClick={() => setActiveTab("unanswered")}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTab === "unanswered"
                                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        }`}
                                >
                                    🔴 Unanswered
                                </button>
                                <button
                                    onClick={() => setActiveTab("popular")}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTab === "popular"
                                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        }`}
                                >
                                    🔥 Popular
                                </button>
                            </div>

                            {/* Search Box */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                    <Input
                                        type="text"
                                        value={keyword}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                                        placeholder="Search questions..."
                                        className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-12 lg:col-span-9">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
                            {/* Header */}
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="font-semibold text-slate-900 dark:text-white">
                                    {keyword.trim()
                                        ? "Search Results"
                                        : activeTab === "unanswered"
                                            ? "Unanswered Questions"
                                            : "Popular Questions"}
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {questions?.length || 0} question(s) found
                                </p>
                            </div>

                            {/* Questions List */}
                            <div className="p-4 space-y-4">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : !selectedCourseId ? (
                                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                        <MessageCircle className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                                        <p>Please select a course to view questions</p>
                                    </div>
                                ) : questions && questions.length > 0 ? (
                                    questions.map((question) => (
                                        <QuestionCard
                                            key={question.id}
                                            comment={question}
                                            onReply={(comment) => setSelectedComment(comment)}
                                            onReport={(comment) => setReportingComment(comment.id)}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                        <MessageCircle className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                                        <p>No questions found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reply Dialog */}
            {selectedComment && (
                <ReplyDialog
                    comment={selectedComment}
                    onClose={() => setSelectedComment(null)}
                />
            )}

            {/* Report Dialog */}
            {reportingComment && (
                <ReportDialog
                    commentId={reportingComment}
                    onClose={() => setReportingComment(null)}
                />
            )}
        </div>
    );
}
