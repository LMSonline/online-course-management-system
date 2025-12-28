"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/Card";
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
} from "@/hooks/teacher";
import { useTeacherId } from "@/hooks/useProfile";
import {
    BookOpen,
    Plus,
    Search,
    Edit,
    Trash2,
    FileQuestion,
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    placeholder="e.g., JavaScript Fundamentals"
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Describe this question bank..."
                    rows={3}
                />
            </div>

            <div className="flex gap-3 justify-end pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
}

export default function QuestionBanksPage() {
    const router = useRouter();
    const teacherId = useTeacherId();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBank, setEditingBank] = useState<QuestionBankResponse | null>(
        null
    );
    const [deletingBank, setDeletingBank] = useState<QuestionBankResponse | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");

    // API Hooks
    const { data: questionBanks = [], isLoading } = useQuestionBanksByTeacher(teacherId ?? null);
    const createMutation = useCreateQuestionBank(teacherId || 0);
    const updateMutation = useUpdateQuestionBank();
    const deleteMutation = useDeleteQuestionBank();

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

    const filteredBanks = questionBanks.filter((bank) =>
        bank.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Question Banks</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Manage your collection of questions for quizzes
                        </p>
                    </div>
                    <Button onClick={handleCreateBank} className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="h-4 w-4 mr-2" />
                        New Question Bank
                    </Button>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search question banks..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    />
                </div>

                {/* Question Banks Grid */}
                {filteredBanks.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                        <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            {searchTerm ? "No question banks found" : "No question banks yet"}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            {searchTerm
                                ? "Try a different search term"
                                : "Create your first question bank to organize your questions"}
                        </p>
                        {!searchTerm && (
                            <Button onClick={handleCreateBank} className="bg-indigo-600 hover:bg-indigo-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Question Bank
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBanks.map((bank) => (
                            <Card
                                key={bank.id}
                                className="hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => router.push(`/teacher/question-banks/${bank.id}`)}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{bank.name}</CardTitle>
                                            {bank.description && (
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {bank.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <FileQuestion className="h-4 w-4" />
                                            <span>Questions</span>
                                        </div>
                                        <span>
                                            {formatDistanceToNow(new Date(bank.createdAt), {
                                                addSuffix: true,
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex gap-2 mt-4 pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditBank(bank);
                                            }}
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeletingBank(bank);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Create/Edit Dialog */}
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
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

                {/* Delete Confirmation Dialog */}
                <AlertDialog
                    open={!!deletingBank}
                    onOpenChange={(open) => !open && setDeletingBank(null)}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Question Bank</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete "{deletingBank?.name}"? This will also
                                delete all questions in this bank and cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteBank}
                                className="bg-red-500 hover:bg-red-600"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
