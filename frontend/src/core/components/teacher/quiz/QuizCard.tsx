"use client";

import React from "react";
import { QuizResponse } from "@/services/assessment/assessment.types";
import {
    Clock,
    FileQuestion,
    MoreVertical,
    Pencil,
    Trash2,
    Target,
    RefreshCcw,
    Shuffle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface QuizCardProps {
    quiz: QuizResponse;
    onEdit: (quiz: QuizResponse) => void;
    onDelete: (quiz: QuizResponse) => void;
}

export function QuizCard({ quiz, onEdit, onDelete }: QuizCardProps) {
    const [showMenu, setShowMenu] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const questionCount = quiz.totalQuestions ?? quiz.questions?.length ?? 0;

    return (
        <div className="group relative bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 dark:hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden backdrop-blur-sm">
            {/* Gradient Accent */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />

            {/* Card Body */}
            <div className="p-5 pt-6">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {quiz.title}
                        </h3>
                        {quiz.description && (
                            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                {quiz.description}
                            </p>
                        )}
                    </div>

                    {/* Menu Button */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-300 transition-all"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        onEdit(quiz);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit Quiz
                                </button>
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        onDelete(quiz);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                        <div className="p-1.5 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                            <FileQuestion className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Questions</p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{questionCount}</p>
                        </div>
                    </div>

                    {quiz.passingScore != null && (
                        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
                                <Target className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Pass Score</p>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{quiz.passingScore}%</p>
                            </div>
                        </div>
                    )}

                    {quiz.timeLimitMinutes != null && (
                        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                                <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Time Limit</p>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{quiz.timeLimitMinutes} min</p>
                            </div>
                        </div>
                    )}

                    {quiz.maxAttempts != null && (
                        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                            <div className="p-1.5 bg-amber-100 dark:bg-amber-500/20 rounded-lg">
                                <RefreshCcw className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Attempts</p>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{quiz.maxAttempts}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Settings indicators */}
                <div className="flex items-center gap-2 mt-4">
                    {quiz.randomizeQuestions && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-medium rounded-lg">
                            <Shuffle className="h-3 w-3" />
                            Random Order
                        </span>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/50">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                    Updated {formatDistanceToNow(new Date(quiz.updatedAt), { addSuffix: true })}
                </p>
            </div>
        </div>
    );
}

export default QuizCard;
