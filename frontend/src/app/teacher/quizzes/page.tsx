"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import {
    QuizCard,
    CreateQuizDialog,
    DeleteQuizDialog,
} from "@/core/components/teacher/quiz";
import {
    useAllIndependentQuizzes,
    useCreateIndependentQuiz,
    useDeleteQuiz,
} from "@/hooks/teacher/useQuizManagement";
import { QuizResponse, QuizRequest } from "@/services/assessment/assessment.types";
import {
    Plus,
    Search,
    Library,
    FileQuestion,
    Loader2,
    RefreshCw,
    Sparkles
} from "lucide-react";

export default function TeacherQuizzesPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState<QuizResponse | null>(null);

    const { data: quizzes = [], isLoading, refetch, isRefetching } = useAllIndependentQuizzes();
    const createMutation = useCreateIndependentQuiz();
    const deleteMutation = useDeleteQuiz();

    const handleCreateQuiz = (values: QuizRequest) => {
        createMutation.mutate(values, {
            onSuccess: (data) => {
                setShowCreateDialog(false);
                router.push(`/teacher/quizzes/${data.id}/edit`);
            },
        });
    };

    const handleDeleteQuiz = () => {
        if (quizToDelete) {
            deleteMutation.mutate(quizToDelete.id, {
                onSuccess: () => {
                    setQuizToDelete(null);
                },
            });
        }
    };

    const filteredQuizzes = quizzes.filter((quiz) =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalQuizzes = quizzes.length;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
                            <Loader2 className="h-12 w-12 animate-spin text-purple-500 relative" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your quizzes...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20">
            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-800/50 rounded-3xl shadow-sm shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-700/50 p-8 backdrop-blur-sm">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl blur-lg opacity-40" />
                                <div className="relative p-4 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl shadow-lg">
                                    <Library className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                    Quiz Library
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">
                                    Create and manage quizzes for your courses
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => refetch()}
                                disabled={isRefetching}
                                className="hidden md:flex bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
                                Refresh
                            </Button>
                            <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 border-0 shadow-lg shadow-purple-500/25">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Create Quiz
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="relative mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-2">
                            <div className="px-4 py-2 bg-purple-50 dark:bg-purple-500/10 rounded-xl">
                                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalQuizzes}</span>
                                <span className="text-sm text-purple-500 dark:text-purple-400 ml-2">Total Quizzes</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/50 p-4 backdrop-blur-sm">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search quizzes by title..."
                            className="pl-12 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-base focus:ring-2 focus:ring-purple-500/20"
                        />
                    </div>
                </div>

                {/* Quiz Grid */}
                {filteredQuizzes.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800/50 rounded-3xl shadow-sm border border-dashed border-slate-300 dark:border-slate-600 backdrop-blur-sm">
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-2xl" />
                                <div className="relative w-24 h-24 bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/30 dark:to-fuchsia-900/30 rounded-full flex items-center justify-center">
                                    <FileQuestion className="h-12 w-12 text-purple-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mt-6 mb-2">
                                {searchTerm ? "No quizzes found" : "No quizzes yet"}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-8">
                                {searchTerm
                                    ? "Try adjusting your search to find what you're looking for."
                                    : "Create your first quiz to get started. You can add questions and configure settings after creation."}
                            </p>
                            {!searchTerm && (
                                <Button onClick={() => setShowCreateDialog(true)} size="lg" className="bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 border-0 shadow-lg shadow-purple-500/25">
                                    <Plus className="mr-2 h-5 w-5" />
                                    Create Your First Quiz
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredQuizzes.length}</span> of {totalQuizzes} quizzes
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredQuizzes.map((quiz) => (
                                <QuizCard
                                    key={quiz.id}
                                    quiz={quiz}
                                    onEdit={(q) => router.push(`/teacher/quizzes/${q.id}/edit`)}
                                    onDelete={(q) => setQuizToDelete(q)}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Dialogs */}
                <CreateQuizDialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                    onSubmit={handleCreateQuiz}
                    isLoading={createMutation.isPending}
                />

                <DeleteQuizDialog
                    quiz={quizToDelete}
                    open={!!quizToDelete}
                    onOpenChange={(open) => !open && setQuizToDelete(null)}
                    onConfirm={handleDeleteQuiz}
                    isLoading={deleteMutation.isPending}
                />
            </div>
        </div>
    );
}
