"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QuizQuestionSummary, QuestionType } from "@/services/assessment/assessment.types";
import {
    GripVertical,
    Trash2,
    CheckCircle2,
    List,
    ToggleLeft,
    PenLine,
    FileText,
    Loader2
} from "lucide-react";

interface QuizQuestionItemProps {
    question: QuizQuestionSummary;
    index: number;
    onRemove: () => void;
    isRemoving?: boolean;
}

const questionTypeConfig: Record<QuestionType, { icon: React.ReactNode; label: string; bgColor: string; iconColor: string }> = {
    MULTIPLE_CHOICE: {
        icon: <CheckCircle2 className="h-4 w-4" />,
        label: "Multiple Choice",
        bgColor: "bg-blue-50 dark:bg-blue-500/10",
        iconColor: "text-blue-600 dark:text-blue-400",
    },
    MULTI_SELECT: {
        icon: <List className="h-4 w-4" />,
        label: "Multi Select",
        bgColor: "bg-purple-50 dark:bg-purple-500/10",
        iconColor: "text-purple-600 dark:text-purple-400",
    },
    TRUE_FALSE: {
        icon: <ToggleLeft className="h-4 w-4" />,
        label: "True/False",
        bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
        iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    FILL_BLANK: {
        icon: <PenLine className="h-4 w-4" />,
        label: "Fill in Blank",
        bgColor: "bg-amber-50 dark:bg-amber-500/10",
        iconColor: "text-amber-600 dark:text-amber-400",
    },
    ESSAY: {
        icon: <FileText className="h-4 w-4" />,
        label: "Essay",
        bgColor: "bg-rose-50 dark:bg-rose-500/10",
        iconColor: "text-rose-600 dark:text-rose-400",
    },
};

export function QuizQuestionItem({ question, index, onRemove, isRemoving }: QuizQuestionItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: question.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Fallback for unknown question types
    const defaultTypeConfig = {
        icon: <FileText className="h-4 w-4" />,
        label: question.questionType || "Unknown",
        bgColor: "bg-slate-50 dark:bg-slate-700/50",
        iconColor: "text-slate-600 dark:text-slate-400",
    };

    const typeConfig = questionTypeConfig[question.questionType] || defaultTypeConfig;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group flex items-start gap-4 p-5 transition-all duration-200 ${isDragging
                ? "bg-purple-50 dark:bg-purple-900/20 shadow-xl shadow-purple-500/10 rounded-xl z-10 border border-purple-200 dark:border-purple-800"
                : "hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                }`}
        >
            {/* Drag Handle */}
            <button
                {...attributes}
                {...listeners}
                className="flex-shrink-0 p-2 rounded-xl cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-600 dark:hover:text-slate-400 transition-all"
            >
                <GripVertical className="h-5 w-5" />
            </button>

            {/* Index Badge */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="text-sm font-bold text-white">
                    {index + 1}
                </span>
            </div>

            {/* Question Content */}
            <div className="flex-1 min-w-0">
                <p className="text-slate-800 dark:text-slate-100 leading-relaxed line-clamp-2 font-medium">
                    {question.questionContent || "No content"}
                </p>
                <div className="flex items-center gap-3 mt-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${typeConfig.bgColor} ${typeConfig.iconColor}`}>
                        {typeConfig.icon}
                        {typeConfig.label}
                    </span>
                    {question.points != null && question.points > 0 && (
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {question.points} {question.points === 1 ? "point" : "points"}
                        </span>
                    )}
                </div>
            </div>

            {/* Remove Button */}
            <button
                onClick={onRemove}
                disabled={isRemoving}
                className="flex-shrink-0 p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50"
            >
                {isRemoving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Trash2 className="h-5 w-5" />
                )}
            </button>
        </div>
    );
}

export default QuizQuestionItem;
