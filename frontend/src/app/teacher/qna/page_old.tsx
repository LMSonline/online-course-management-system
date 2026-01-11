"use client";

import { useState } from "react";
import {
    Search,
    MessageSquare,
    ThumbsUp,
    Reply,
    FileText,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

interface Question {
    id: number;
    studentName: string;
    studentAvatar: string;
    course: string;
    question: string;
    category: string;
    timestamp: string;
    likes: number;
    replies: number;
    status: "Unanswered" | "Answered" | "Resolved";
    isInstructor?: boolean;
}

export default function TeacherQnAPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState<"All Questions" | "Unanswered" | "Answered">("All Questions");
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [replyText, setReplyText] = useState("");

    // Mock data - Replace with real API call
    const mockQuestions: Question[] = [
        {
            id: 1,
            studentName: "John Davis",
            studentAvatar: "https://ui-avatars.com/api/?name=John+Davis&background=6366f1&color=fff",
            course: "Complete Web Development Bootcamp 2025 - JavaScript Fundamentals - Functions and Scope",
            question: "Can you explain the difference between let, const, and var? I'm confused about when to use each one.",
            category: "JavaScript",
            timestamp: "2 hours ago",
            likes: 12,
            replies: 3,
            status: "Unanswered",
        },
        {
            id: 2,
            studentName: "Maria Garcia",
            studentAvatar: "https://ui-avatars.com/api/?name=Maria+Garcia&background=ec4899&color=fff",
            course: "Complete Web Development Bootcamp 2025 - CSS Styling - Flexbox Layout",
            question: "How do I center a div both horizontally and vertically using Flexbox?",
            category: "CSS",
            timestamp: "5 hours ago",
            likes: 8,
            replies: 0,
            status: "Answered",
        },
        {
            id: 3,
            studentName: "Sarah Johnson",
            studentAvatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff",
            course: "Great question! You can use display: flex with justify-content: center and align-items: center on the parent container. This will center the child element both horizontally and vertically. The key difference is...",
            question: "Great question! You can use display: flex with justify-content: center and align-items: center on the parent container. This will center the child element both horizontally and vertically. The key difference is...",
            category: "CSS",
            timestamp: "4 hours ago",
            likes: 0,
            replies: 0,
            status: "Answered",
            isInstructor: true,
        },
        {
            id: 4,
            studentName: "Robert Kim",
            studentAvatar: "https://ui-avatars.com/api/?name=Robert+Kim&background=f59e0b&color=fff",
            course: "Advanced React Patterns + React Hooks - useEffect",
            question: "Why is my useEffect running on every render? I thought it should only run once.",
            category: "React",
            timestamp: "1 day ago",
            likes: 15,
            replies: 1,
            status: "Unanswered",
        },
        {
            id: 5,
            studentName: "Sarah Johnson",
            studentAvatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff",
            course: "Advanced React Patterns + React Hooks - Array Dependency",
            question: "Thank you! That makes total sense now. So with passing an empty dependency array [] means it will only run on mount, and without any array it runs every render. Got it!",
            category: "React",
            timestamp: "23 hours ago",
            likes: 4,
            replies: 0,
            status: "Unanswered",
            isInstructor: false,
        },
        {
            id: 6,
            studentName: "Sophie Anderson",
            studentAvatar: "https://ui-avatars.com/api/?name=Sophie+Anderson&background=8b5cf6&color=fff",
            course: "Node.js Deep Dive + Express.js - Middleware",
            question: "What's the difference between app.use() and app.get() in Express?",
            category: "Node.js",
            timestamp: "3 days ago",
            likes: 5,
            replies: 1,
            status: "Unanswered",
        },
        {
            id: 7,
            studentName: "Ahmed Hassan",
            studentAvatar: "https://ui-avatars.com/api/?name=Ahmed+Hassan&background=ef4444&color=fff",
            course: "Complete Web Development Bootcamp 2025 - JavaScript Fundamentals - Arrays",
            question: "When should I use map() vs forEach() when working with arrays?",
            category: "JavaScript",
            timestamp: "4 days ago",
            likes: 20,
            replies: 0,
            status: "Unanswered",
        },
        {
            id: 8,
            studentName: "Sarah Johnson",
            studentAvatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff",
            course: "JavaScript Array Methods",
            question: "Use map() when you want to transform an array and get a new array back. Use forEach() when you just want to iterate and perform side effects. The key difference is...",
            category: "JavaScript",
            timestamp: "4 days ago",
            likes: 1,
            replies: 2,
            status: "Answered",
            isInstructor: true,
        },
    ];

    // Calculate statistics
    const stats = {
        total: mockQuestions.filter(q => !q.isInstructor).length,
        unanswered: mockQuestions.filter(q => q.status === "Unanswered" && !q.isInstructor).length,
        answered: mockQuestions.filter(q => q.status === "Answered" && !q.isInstructor).length,
        responseRate: Math.round((mockQuestions.filter(q => q.status === "Answered").length / mockQuestions.filter(q => !q.isInstructor).length) * 100),
    };

    // Filter questions
    const filteredQuestions = mockQuestions.filter((question) => {
        const matchesSearch =
            question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            question.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            question.course.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            selectedFilter === "All Questions" ||
            (selectedFilter === "Unanswered" && question.status === "Unanswered") ||
            (selectedFilter === "Answered" && question.status === "Answered");

        return matchesSearch && matchesFilter;
    });

    const handleReply = () => {
        if (replyText.trim()) {
            console.log("Reply submitted:", replyText);
            // TODO: Integrate with API
            setReplyText("");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Q&A</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Answer student questions and engage with your community
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Questions</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.total}</p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">All time</p>
                            </div>
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Unanswered</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.unanswered}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Need response</p>
                            </div>
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Answered</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.answered}</p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Resolved</p>
                            </div>
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Response Rate</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.responseRate}%</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Last 30 days</p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2">
                            {(["All Questions", "Unanswered", "Answered"] as const).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter)}
                                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${selectedFilter === filter
                                            ? "bg-indigo-600 text-white shadow-lg"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                        }`}
                                >
                                    {filter} ({filter === "All Questions" ? stats.total : filter === "Unanswered" ? stats.unanswered : stats.answered})
                                </button>
                            ))}
                        </div>
                        <select className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>All Courses</option>
                            <option>Complete Web Development Bootcamp</option>
                            <option>Advanced React Patterns</option>
                            <option>Node.js Deep Dive</option>
                        </select>
                    </div>
                </div>

                {/* Questions List */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                        {filteredQuestions.length === 0 ? (
                            <div className="p-12 text-center">
                                <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                <p className="text-slate-600 dark:text-slate-400">No questions found</p>
                            </div>
                        ) : (
                            filteredQuestions.map((question) => (
                                <div
                                    key={question.id}
                                    className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="flex gap-4">
                                        <img
                                            src={question.studentAvatar}
                                            alt={question.studentName}
                                            className="w-12 h-12 rounded-full flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            {question.studentName}
                                                        </h3>
                                                        {question.isInstructor && (
                                                            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded">
                                                                Instructor
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                            {question.timestamp}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                        {question.course}
                                                    </p>
                                                </div>
                                                {!question.isInstructor && (
                                                    <span
                                                        className={`px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${question.status === "Unanswered"
                                                                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                                                                : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                                                            }`}
                                                    >
                                                        {question.status}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-900 dark:text-white text-sm leading-relaxed mb-3">
                                                {question.question}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm">
                                                <button className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                                    <ThumbsUp className="w-4 h-4" />
                                                    <span>{question.likes}</span>
                                                </button>
                                                <button className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                                    <Reply className="w-4 h-4" />
                                                    <span>Reply</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
