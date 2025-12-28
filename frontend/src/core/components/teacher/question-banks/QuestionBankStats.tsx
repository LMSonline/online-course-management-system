"use client";

import React from "react";
import { QuestionResponse } from "@/services/assessment/assessment.types";
import { calculateBankStats, getTypeConfig } from "@/lib/teacher/question-banks/questionHelpers";
import { BarChart3, Target, Trophy } from "lucide-react";

interface QuestionBankStatsProps {
    questions: QuestionResponse[];
}

export function QuestionBankStats({
    questions,
}: QuestionBankStatsProps) {
    const stats = calculateBankStats(questions);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                Question Bank Statistics
            </h3>

            <div className="grid grid-cols-1 gap-4 mb-6">
                {/* Total Questions */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Questions</p>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {stats.total}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                            <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>

                {/* Total Points */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Points</p>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {stats.totalPoints.toFixed(1)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                {/* Average Points */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg p-4 border border-green-100 dark:border-green-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Points/Question</p>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {stats.avgPoints.toFixed(1)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Question Types Breakdown */}
            {stats.total > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Questions by Type
                    </h4>
                    <div className="space-y-2">
                        {Object.entries(stats.byType).map(([type, count]) => {
                            const config = getTypeConfig(type as any);
                            const percentage = ((count / stats.total) * 100).toFixed(1);

                            return (
                                <div key={type} className="flex items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {config.label}
                                            </span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                                {count} ({percentage}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-400 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {stats.total === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <p className="text-sm">No questions yet</p>
                    <p className="text-xs mt-1">Add questions to see statistics</p>
                </div>
            )}
        </div>
    );
}
