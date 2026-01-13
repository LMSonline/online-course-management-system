"use client";

import { useState } from "react";
import Button from "@/core/components/ui/Button";
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
import { AssignmentForm } from "./AssignmentForm";
import {
    useAssignmentsByLesson,
    useCreateAssignment,
    useUpdateAssignment,
    useDeleteAssignment,
} from "@/hooks/teacher";
import {
    AssignmentResponse,
    AssignmentRequest,
} from "@/services/assignment/assignment.types";
import {
    Plus,
    Edit,
    Trash2,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, isPast } from "date-fns";

interface LessonAssignmentManagementProps {
    lessonId: number;
    lessonTitle?: string;
}

export function LessonAssignmentManagement({
    lessonId,
    lessonTitle,
}: LessonAssignmentManagementProps) {
    const router = useRouter();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] =
        useState<AssignmentResponse | null>(null);
    const [deletingAssignment, setDeletingAssignment] =
        useState<AssignmentResponse | null>(null);

    // API Hooks
    const { data: assignments = [], isLoading } = useAssignmentsByLesson(lessonId);
    const createMutation = useCreateAssignment(lessonId);
    const updateMutation = useUpdateAssignment();
    const deleteMutation = useDeleteAssignment();

    const handleCreateAssignment = () => {
        setEditingAssignment(null);
        setIsFormOpen(true);
    };

    const handleEditAssignment = (assignment: AssignmentResponse) => {
        setEditingAssignment(assignment);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (data: AssignmentRequest) => {
        if (editingAssignment) {
            await updateMutation.mutateAsync({
                id: editingAssignment.id,
                payload: data,
            });
        } else {
            await createMutation.mutateAsync(data);
        }
        setIsFormOpen(false);
        setEditingAssignment(null);
    };

    const handleDeleteAssignment = async () => {
        if (deletingAssignment) {
            await deleteMutation.mutateAsync(deletingAssignment.id);
            setDeletingAssignment(null);
        }
    };

    const handleViewSubmissions = (assignmentId: number) => {
        router.push(`/teacher/assignments/${assignmentId}/submissions`);
    };

    const getStatusBadge = (assignment: AssignmentResponse) => {
        // Check if due date has passed
        if (assignment.dueDate && isPast(new Date(assignment.dueDate))) {
            return (
                <Badge variant="destructive" className="bg-orange-100 text-orange-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Closed
                </Badge>
            );
        }

        return (
            <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Open
            </Badge>
        );
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
                    <h2 className="text-2xl font-bold">Assignments</h2>
                    {lessonTitle && (
                        <p className="text-muted-foreground">
                            {lessonTitle} - {assignments.length} assignment
                            {assignments.length !== 1 && "s"}
                        </p>
                    )}
                </div>
                <Button onClick={handleCreateAssignment}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Assignment
                </Button>
            </div>

            {/* Assignment List */}
            {assignments.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No assignments yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Create your first assignment to assess student work
                    </p>
                    <Button onClick={handleCreateAssignment}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Assignment
                    </Button>
                </div>
            ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Max Score</TableHead>
                                <TableHead>Submissions</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Updated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignments.map((assignment) => (
                                <TableRow key={assignment.id}>
                                    <TableCell className="font-medium">
                                        {assignment.title}
                                    </TableCell>
                                    <TableCell>
                                        {assignment.dueDate ? (
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span className="text-sm">
                                                    {formatDistanceToNow(new Date(assignment.dueDate), {
                                                        addSuffix: true,
                                                    })}
                                                </span>
                                                {isPast(new Date(assignment.dueDate)) && (
                                                    <AlertCircle className="h-3 w-3 text-orange-500 ml-1" />
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">No due date</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{assignment.totalPoints || "-"} pts</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span>-</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(assignment)}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {formatDistanceToNow(new Date(assignment.updatedAt), {
                                            addSuffix: true,
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewSubmissions(assignment.id)}
                                                title="View Submissions"
                                            >
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditAssignment(assignment)}
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeletingAssignment(assignment)}
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

            {/* Create/Edit Assignment Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAssignment ? "Edit Assignment" : "Create Assignment"}
                        </DialogTitle>
                    </DialogHeader>
                    <AssignmentForm
                        initialData={editingAssignment || undefined}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setIsFormOpen(false)}
                        isSubmitting={createMutation.isPending || updateMutation.isPending}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deletingAssignment}
                onOpenChange={(open) => !open && setDeletingAssignment(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Assignment</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{deletingAssignment?.title}"? This
                            will also delete all student submissions and cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAssignment}
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
