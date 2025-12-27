// src/core/components/teacher/dashboard/TopStudents.tsx
"use client";

import { Award, TrendingUp } from "lucide-react";

interface Student {
    id: number;
    name: string;
    avatar: string;
    coursesCompleted: number;
    avgScore: number;
    progress: number;
}

interface TopStudentsProps {
    students: Student[];
}

export function TopStudents({ students }: TopStudentsProps) {
    return (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Top Performers
                </h2>
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>

            <div className="space-y-4">
                {students.map((student, index) => (
                    <div
                        key={student.id}
                        className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <div className="relative">
                            <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-12 h-12 rounded-full"
                            />
                            {index < 3 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {index + 1}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                {student.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                    {student.coursesCompleted} courses
                                </span>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                    {student.avgScore}% avg
                                </span>
                            </div>
                            <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                    style={{ width: `${student.progress}%` }}
                                />
                            </div>
                        </div>

                        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                ))}

                {students.length === 0 && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-8">
                        No student data available
                    </p>
                )}
            </div>
        </section>
    );
}
