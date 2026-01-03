"use client";

import { useState } from "react";
import  Button  from "@/core/components/ui/Button";
import Dialog, {
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/core/components/ui/Dialog";
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/core/components/ui/Table";
import Badge from "@/core/components/ui/Badge";
import AlertDialog, {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/core/components/ui/AlertDialog";
import { QuizForm } from "./QuizForm";
import {
    useQuizzesByLesson,
    useCreateQuiz,
    useUpdateQuiz,
    useDeleteQuiz,
} from "@/hooks/teacher";
import { QuizResponse, QuizRequest } from "@/services/assessment/assessment.types";
import {
    Plus,
    Edit,
    Trash2,
    BarChart3,
    Clock,
    FileText,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface LessonQuizManagementProps {
    lessonId: number;
    lessonTitle?: string;
}

export function LessonQuizManagement({
    lessonId,
    lessonTitle,
}: LessonQuizManagementProps) {
    const router = useRouter();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<QuizResponse | null>(null);
    const [deletingQuiz, setDeletingQuiz] = useState<QuizResponse | null>(null);

    // API Hooks
    const { data: quizzes = [], isLoading } = useQuizzesByLesson(lessonId);
    const createMutation = useCreateQuiz(lessonId);
    const updateMutation = useUpdateQuiz();
    const deleteMutation = useDeleteQuiz();

    const handleCreateQuiz = () => {
        setEditingQuiz(null);
        setIsFormOpen(true);
    };

    const handleEditQuiz = (quiz: QuizResponse) => {
        setEditingQuiz(quiz);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (data: QuizRequest) => {
        if (editingQuiz) {
            await updateMutation.mutateAsync({ id: editingQuiz.id, payload: data });
        } else {
            await createMutation.mutateAsync(data);
        }
        setIsFormOpen(false);
        setEditingQuiz(null);
    };

    const handleDeleteQuiz = async () => {
        if (deletingQuiz) {
            await deleteMutation.mutateAsync(deletingQuiz.id);
            setDeletingQuiz(null);
        }
    };

    const handleViewResults = (quizId: number) => {
        router.push(`/teacher/quizzes/${quizId}/results`);
    };

    const handleEditQuizContent = (quizId: number) => {
        router.push(`/teacher/quizzes/${quizId}/edit`);
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            DRAFT: { variant: "secondary" as const, label: "Draft" },
            PUBLISHED: { variant: "default" as const, label: "Published" },
            ARCHIVED: { variant: "outline" as const, label: "Archived" },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const getQuizTypeBadge = (type: string) => {
        const typeConfig = {
            PRACTICE: { className: "bg-blue-100 text-blue-800", label: "Practice" },
            GRADED: { className: "bg-green-100 text-green-800", label: "Graded" },
            FINAL: { className: "bg-red-100 text-red-800", label: "Final" },
        };
        const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.PRACTICE;
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Quizzes</h2>
                    {lessonTitle && (
                        <p className="text-muted-foreground">
                            {lessonTitle} - {quizzes.length} quiz{quizzes.length !== 1 && "zes"}
                        </p>
                    )}
                </div>
                <Button onClick={handleCreateQuiz}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Quiz
                </Button>
            </div>

            {/* Quiz List */}
            {quizzes.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No quizzes yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Create your first quiz to assess student learning
                    </p>
                    <Button onClick={handleCreateQuiz}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Quiz
                    </Button>
                </div>
            ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Questions</TableHead>
                                <TableHead>Time Limit</TableHead>
                                <TableHead>Passing Score</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Updated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quizzes.map((quiz) => (
                                <TableRow key={quiz.id}>
                                    <TableCell className="font-medium">{quiz.title}</TableCell>
                                    <TableCell>{getQuizTypeBadge(quiz.quizType)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <FileText className="h-4 w-4" />
                                            {quiz.totalQuestions || 0}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {quiz.timeLimit ? (
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {quiz.timeLimit} min
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">No limit</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {quiz.passingScore ? `${quiz.passingScore}%` : "-"}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(quiz.status)}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {formatDistanceToNow(new Date(quiz.updatedAt), {
                                            addSuffix: true,
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditQuizContent(quiz.id)}
                                                title="Edit Questions"
                                            >
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditQuiz(quiz)}
                                                title="Edit Settings"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewResults(quiz.id)}
                                                title="View Results"
                                            >
                                                <BarChart3 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeletingQuiz(quiz)}
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Create/Edit Quiz Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingQuiz ? "Edit Quiz Settings" : "Create New Quiz"}
                        </DialogTitle>
                    </DialogHeader>
                    <QuizForm
                        initialData={editingQuiz || undefined}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setIsFormOpen(false)}
                        isSubmitting={createMutation.isPending || updateMutation.isPending}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deletingQuiz}
                onOpenChange={(open) => !open && setDeletingQuiz(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{deletingQuiz?.title}"? This action
                            cannot be undone and will delete all associated questions and student
                            attempts.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteQuiz}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
