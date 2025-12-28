"use client";

import { ThumbsUp, Reply } from "lucide-react";

interface QuestionCardProps {
    studentName: string;
    studentAvatar: string;
    course: string;
    question: string;
    timestamp: string;
    likes: number;
    status: "Unanswered" | "Answered" | "Resolved";
    isInstructor?: boolean;
    onReply?: () => void;
    onLike?: () => void;
}

export const QuestionCard = ({
    studentName,
    studentAvatar,
    course,
    question,
    timestamp,
    likes,
    status,
    isInstructor = false,
    onReply,
    onLike,
}: QuestionCardProps) => {
    return (
        <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex gap-4">
                <img
                    src={studentAvatar}
                    alt={studentName}
                    className="w-12 h-12 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {studentName}
                                </h3>
                                {isInstructor && (
                                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded">
                                        Instructor
                                    </span>
                                )}
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {timestamp}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                {course}
                            </p>
                        </div>
                        {!isInstructor && (
                            <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${status === "Unanswered"
                                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                                        : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                                    }`}
                            >
                                {status}
                            </span>
                        )}
                    </div>
                    <p className="text-slate-900 dark:text-white text-sm leading-relaxed mb-3">
                        {question}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                        <button
                            onClick={onLike}
                            className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{likes}</span>
                        </button>
                        <button
                            onClick={onReply}
                            className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            <Reply className="w-4 h-4" />
                            <span>Reply</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
