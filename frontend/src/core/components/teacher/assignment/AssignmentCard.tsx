"use client";

import React from "react";
import { AssignmentResponse } from "@/services/assignment/assignment.types";
import {
    Clock,
    FileText,
    MoreVertical,
    Pencil,
    Trash2,
    Copy,
    CheckCircle2,
    AlertCircle,
    Users,
    Target,
    CalendarClock
} from "lucide-react";
import { formatDistanceToNow, format, isPast } from "date-fns";

interface AssignmentCardProps {
    assignment: AssignmentResponse;
    onEdit: (assignment: AssignmentResponse) => void;
    onDelete: (assignment: AssignmentResponse) => void;
    onClone?: (assignment: AssignmentResponse) => void;
}

export function AssignmentCard({ assignment, onEdit, onDelete, onClone }: AssignmentCardProps) {
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

    const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
    const isOverdue = dueDate && isPast(dueDate);

    return (
        <div className="group relative bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden backdrop-blur-sm">
            {/* Gradient Accent */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500" />

            {/* Card Body */}
            <div className="p-5 pt-6">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
                            {assignment.title}
                        </h3>
                        {assignment.description && (
                            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                {assignment.description}
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
                            <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 py-1.5 z-20">
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        onEdit(assignment);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit
                                </button>
                                {onClone && (
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            onClone(assignment);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                    >
                                        <Copy className="h-4 w-4" />
                                        Clone
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        onDelete(assignment);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
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
                    {assignment.totalPoints != null && (
                        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
                                <Target className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Points</p>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    {assignment.totalPoints}
                                </p>
                            </div>
                        </div>
                    )}

                    {dueDate && (
                        <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl ${isOverdue ? "bg-red-50 dark:bg-red-500/10" : "bg-slate-50 dark:bg-slate-700/30"}`}>
                            <div className={`p-1.5 rounded-lg ${isOverdue ? "bg-red-100 dark:bg-red-500/20" : "bg-purple-100 dark:bg-purple-500/20"}`}>
                                <CalendarClock className={`h-3.5 w-3.5 ${isOverdue ? "text-red-600 dark:text-red-400" : "text-purple-600 dark:text-purple-400"}`} />
                            </div>
                            <div>
                                <p className={`text-xs ${isOverdue ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`}>
                                    {isOverdue ? "Overdue" : "Due"}
                                </p>
                                <p className={`text-sm font-semibold ${isOverdue ? "text-red-700 dark:text-red-300" : "text-slate-700 dark:text-slate-200"}`}>
                                    {format(dueDate, "MMM d")}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/50">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                    Updated {formatDistanceToNow(new Date(assignment.updatedAt), { addSuffix: true })}
                </p>
            </div>
        </div>
    );
}

export default AssignmentCard;
