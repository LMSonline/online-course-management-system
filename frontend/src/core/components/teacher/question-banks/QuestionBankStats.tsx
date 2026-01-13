"use client";

import React from "react";
import { QuestionResponse } from "@/services/assessment/assessment.types";
import { calculateBankStats, getTypeConfig } from "@/lib/teacher/question-banks/questionHelpers";
import { BarChart3, Target, Trophy, Sparkles } from "lucide-react";

interface QuestionBankStatsProps {
    questions: QuestionResponse[];
}

export function QuestionBankStats({
    questions,
}: QuestionBankStatsProps) {
    const stats = calculateBankStats(questions);

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-700/50">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Bank Statistics
                </h3>
            </div>

            <div className="p-5 space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-3">
                    {/* Total Questions */}
                    <div className="group relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/50 overflow-hidden transition-all hover:shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Questions</p>
                                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
                                <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                    </div>

                    {/* Points Row */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Total Points */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-xl p-4 border border-amber-100 dark:border-amber-800/50">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Total Pts</p>
                            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                                {stats.totalPoints.toFixed(0)}
                            </p>
                        </div>

                        {/* Average Points */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800/50">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Avg Pts</p>
                            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                {stats.avgPoints.toFixed(1)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Question Types Breakdown */}
                {stats.total > 0 && (
                    <div>
                        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                            By Type
                        </h4>
                        <div className="space-y-3">
                            {Object.entries(stats.byType).map(([type, count]) => {
                                const config = getTypeConfig(type as any);
                                const percentage = (count / stats.total) * 100;

                                return (
                                    <div key={type}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {config.label}
                                            </span>
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                {count}
                                            </span>
                                        </div>
                                        <div className="relative w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {stats.total === 0 && (
                    <div className="text-center py-6">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No questions yet</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Add questions to see stats</p>
                    </div>
                )}
            </div>
        </div>
    );
}
