"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/core/components/ui/Dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/core/components/ui/AlertDialog";
import {
    useQuestionBanksByTeacher,
    useCreateQuestionBank,
    useUpdateQuestionBank,
    useDeleteQuestionBank,
    useCloneQuestionBank,
} from "@/hooks/teacher";
import { useTeacherId } from "@/hooks/useProfile";
import {
    BookOpen,
    Plus,
    Search,
    Edit,
    Trash2,
    FileQuestion,
    Copy,
    FolderOpen,
    MoreVertical,
    Clock,
    TrendingUp,
    Layers,
    Sparkles,
} from "lucide-react";
import {
    QuestionBankRequest,
    QuestionBankResponse,
} from "@/services/assessment/assessment.types";
import { useForm } from "react-hook-form";
import Label from "@/core/components/ui/Label";
import Textarea from "@/core/components/ui/Textarea";
import { formatDistanceToNow } from "date-fns";

// Question Bank Form Component
function QuestionBankForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
}: {
    initialData?: QuestionBankResponse;
    onSubmit: (data: QuestionBankRequest) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<QuestionBankRequest>({
        defaultValues: initialData || {
            name: "",
            description: "",
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 dark:text-slate-200 font-medium">
                    Name <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    placeholder="e.g., JavaScript Fundamentals"
                    className="h-11 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 dark:text-slate-200 font-medium">
                    Description
                </Label>
                <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Describe this question bank..."
                    rows={3}
                    className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
            </div>

            <div className="flex gap-3 justify-end pt-5 border-t border-slate-200 dark:border-slate-700">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="px-5 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </span>
                    ) : initialData ? "Update Bank" : "Create Bank"}
                </Button>
            </div>
        </form>
    );
}

// Card Actions Dropdown
function CardActions({
    bank,
    onEdit,
    onClone,
    onDelete,
}: {
    bank: QuestionBankResponse;
    onEdit: () => void;
    onClone: () => void;
    onDelete: () => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
            >
                <MoreVertical className="h-5 w-5" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 z-50 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClone();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                            <Copy className="h-4 w-4" />
                            Clone
                        </button>
                        <div className="border-t border-slate-200 dark:border-slate-700 my-1.5" />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default function QuestionBanksPage() {
    const router = useRouter();
    const teacherId = useTeacherId();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBank, setEditingBank] = useState<QuestionBankResponse | null>(null);
    const [deletingBank, setDeletingBank] = useState<QuestionBankResponse | null>(null);
    const [cloningBank, setCloningBank] = useState<QuestionBankResponse | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "date">("date");

    // API Hooks
    const { data: questionBanks = [], isLoading } = useQuestionBanksByTeacher(teacherId ?? null);
    const createMutation = useCreateQuestionBank(teacherId || 0);
    const updateMutation = useUpdateQuestionBank();
    const deleteMutation = useDeleteQuestionBank();
    const cloneMutation = useCloneQuestionBank();

    const handleCreateBank = () => {
        setEditingBank(null);
        setIsFormOpen(true);
    };

    const handleEditBank = (bank: QuestionBankResponse) => {
        setEditingBank(bank);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (data: QuestionBankRequest) => {
        if (editingBank) {
            await updateMutation.mutateAsync({ id: editingBank.id, payload: data });
        } else {
            await createMutation.mutateAsync(data);
        }
        setIsFormOpen(false);
        setEditingBank(null);
    };

    const handleDeleteBank = async () => {
        if (deletingBank) {
            await deleteMutation.mutateAsync(deletingBank.id);
            setDeletingBank(null);
        }
    };

    const handleCloneBank = async () => {
        if (cloningBank && teacherId) {
            await cloneMutation.mutateAsync({
                bankId: cloningBank.id,
                targetTeacherId: teacherId,
            });
            setCloningBank(null);
        }
    };

    const filteredBanks = useMemo(() => {
        return questionBanks
            .filter((bank) => bank.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                if (sortBy === "name") {
                    return a.name.localeCompare(b.name);
                }
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
    }, [questionBanks, searchTerm, sortBy]);

    // Stats calculations
    const stats = useMemo(() => ({
        totalBanks: questionBanks.length,
        recentBanks: questionBanks.filter(b => {
            const dayAgo = new Date();
            dayAgo.setDate(dayAgo.getDate() - 7);
            return new Date(b.createdAt) > dayAgo;
        }).length,
    }), [questionBanks]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900" />
                        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Loading question banks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
                                <Layers className="h-6 w-6" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Question Banks
                            </h1>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 max-w-xl">
                            Organize and manage your questions for quizzes and assessments
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-6 px-5 py-3 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                                    <FolderOpen className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalBanks}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Total Banks</p>
                                </div>
                            </div>
                            {stats.recentBanks > 0 && (
                                <>
                                    <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                                            <TrendingUp className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">+{stats.recentBanks}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">This Week</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <Button
                            onClick={handleCreateBank}
                            className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            New Bank
                        </Button>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Search question banks..."
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            className="h-12 pl-12 pr-4 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
                        />
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as "name" | "date")}
                        className="h-12 px-4 pr-10 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-sm appearance-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '1.25rem',
                        }}
                    >
                        <option value="date">Newest First</option>
                        <option value="name">Name A-Z</option>
                    </select>
                </div>

                {/* Question Banks Grid */}
                {filteredBanks.length === 0 ? (
                    <div className="relative overflow-hidden bg-white dark:bg-slate-800/30 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-12 text-center">
                        {/* Decorative background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full blur-3xl" />

                        <div className="relative">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-600 dark:text-indigo-400 mb-6">
                                {searchTerm ? (
                                    <Search className="w-10 h-10" />
                                ) : (
                                    <Sparkles className="w-10 h-10" />
                                )}
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                {searchTerm ? "No question banks found" : "Create your first question bank"}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                                {searchTerm
                                    ? "Try adjusting your search term to find what you're looking for"
                                    : "Question banks help you organize questions by topic, making it easy to create quizzes and assessments"}
                            </p>
                            {!searchTerm && (
                                <Button
                                    onClick={handleCreateBank}
                                    className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/25"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Create Question Bank
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredBanks.map((bank) => (
                            <div
                                key={bank.id}
                                onClick={() => router.push(`/teacher/question-banks/${bank.id}`)}
                                className="group relative bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-600/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer"
                            >
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-purple-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                                <div className="relative p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {bank.name}
                                            </h3>
                                            {bank.description && (
                                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                                    {bank.description}
                                                </p>
                                            )}
                                        </div>
                                        <CardActions
                                            bank={bank}
                                            onEdit={() => handleEditBank(bank)}
                                            onClone={() => setCloningBank(bank)}
                                            onDelete={() => setDeletingBank(bank)}
                                        />
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                            <FileQuestion className="h-4 w-4" />
                                            <span className="text-sm font-medium">Questions</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span className="text-xs">
                                                {formatDistanceToNow(new Date(bank.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom accent line on hover */}
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Create/Edit Dialog */}
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                                {editingBank ? "Edit Question Bank" : "Create Question Bank"}
                            </DialogTitle>
                        </DialogHeader>
                        <QuestionBankForm
                            initialData={editingBank || undefined}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setIsFormOpen(false)}
                            isSubmitting={createMutation.isPending || updateMutation.isPending}
                        />
                    </DialogContent>
                </Dialog>

                {/* Clone Confirmation Dialog */}
                <AlertDialog
                    open={!!cloningBank}
                    onOpenChange={(open) => !open && setCloningBank(null)}
                >
                    <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-slate-900 dark:text-white">
                                Clone Question Bank
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                                This will create a copy of "{cloningBank?.name}" including all its questions.
                                The new bank will be added to your collection.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => setCloningBank(null)}
                                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleCloneBank}
                                disabled={cloneMutation.isPending}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                {cloneMutation.isPending ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Cloning...
                                    </span>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Clone Bank
                                    </>
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog
                    open={!!deletingBank}
                    onOpenChange={(open) => !open && setDeletingBank(null)}
                >
                    <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-slate-900 dark:text-white">
                                Delete Question Bank
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                                Are you sure you want to delete "{deletingBank?.name}"? This will also
                                delete all questions in this bank. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => setDeletingBank(null)}
                                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteBank}
                                disabled={deleteMutation.isPending}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {deleteMutation.isPending ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Deleting...
                                    </span>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Bank
                                    </>
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
