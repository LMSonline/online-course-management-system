"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuizById } from "@/hooks/teacher/useQuizManagement";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/core/components/ui/Tabs";
import { QuizSettingsTab } from "@/core/components/teacher/quiz/QuizSettingsTab";
import { QuizQuestionsTab } from "@/core/components/teacher/quiz/QuizQuestionsTab";
import { QuizResultsTab } from "@/core/components/teacher/quiz/QuizResultsTab";
import Button from "@/core/components/ui/Button";
import { ArrowLeft, Settings, FileQuestion, BarChart3, Loader2, Clock, Target } from "lucide-react";

export default function QuizBuilderPage() {
    const params = useParams();
    const router = useRouter();
    const quizId = Number(params.id);
    const [activeTab, setActiveTab] = useState("settings");

    const { data: quiz, isLoading, error } = useQuizById(quizId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
                            <Loader2 className="h-12 w-12 animate-spin text-purple-500 relative" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading quiz...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !quiz) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileQuestion className="h-10 w-10 text-slate-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Quiz not found</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                            The quiz you are looking for does not exist or has been deleted.
                        </p>
                        <Button onClick={() => router.push("/teacher/quizzes")} className="mt-6 bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 border-0">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Quiz Library
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const questionCount = quiz.totalQuestions ?? quiz.questions?.length ?? 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push("/teacher/quizzes")}
                                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {quiz.title}
                                </h1>
                                <div className="flex items-center gap-3 mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1.5">
                                        <FileQuestion className="h-4 w-4" />
                                        {questionCount} questions
                                    </span>
                                    {quiz.timeLimitMinutes && (
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4" />
                                            {quiz.timeLimitMinutes} min
                                        </span>
                                    )}
                                    {quiz.passingScore && (
                                        <span className="flex items-center gap-1.5">
                                            <Target className="h-4 w-4" />
                                            {quiz.passingScore}% to pass
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="container mx-auto px-6 py-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full max-w-md bg-white dark:bg-slate-800/50 p-1.5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/50">
                        <TabsTrigger
                            value="settings"
                            className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl py-2.5 transition-all"
                        >
                            <Settings className="h-4 w-4" />
                            Settings
                        </TabsTrigger>
                        <TabsTrigger
                            value="questions"
                            className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl py-2.5 transition-all"
                        >
                            <FileQuestion className="h-4 w-4" />
                            Questions
                            {questionCount > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                                    {questionCount}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="results"
                            className="flex-1 flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl py-2.5 transition-all"
                        >
                            <BarChart3 className="h-4 w-4" />
                            Results
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="settings" className="mt-6">
                        <QuizSettingsTab quiz={quiz} />
                    </TabsContent>

                    <TabsContent value="questions" className="mt-6">
                        <QuizQuestionsTab quizId={quizId} />
                    </TabsContent>

                    <TabsContent value="results" className="mt-6">
                        <QuizResultsTab quizId={quizId} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
