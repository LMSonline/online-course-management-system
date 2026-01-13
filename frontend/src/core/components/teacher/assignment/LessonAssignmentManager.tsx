"use client";

import React, { useState } from "react";
import { AssignmentResponse, AssignmentRequest } from "@/services/assignment/assignment.types";
import {
    useAssignmentsByLesson,
    useAllIndependentAssignments,
    useLinkAssignmentToLesson,
    useUnlinkAssignmentFromLesson,
    useCreateIndependentAssignment,
} from "@/hooks/teacher/useTeacherAssignment";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/core/components/ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/core/components/ui/Dialog";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import Textarea from "@/core/components/ui/Textarea";
import Label from "@/core/components/ui/Label";
import Switch from "@/core/components/ui/Switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/core/components/ui/DropdownMenu";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "@/core/components/ui/AlertDialog";
import {
    FileText,
    Plus,
    Link2,
    Unlink2,
    ChevronDown,
    Loader2,
    Calendar,
    Target,
    Clock,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Search
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

// Utility to convert datetime-local value to ISO 8601 Instant format
const formatToInstant = (dateTimeLocal: string): string | undefined => {
    if (!dateTimeLocal) return undefined;
    const date = new Date(dateTimeLocal);
    return date.toISOString();
};

interface LessonAssignmentManagerProps {
    lessonId: number;
}

export function LessonAssignmentManager({ lessonId }: LessonAssignmentManagerProps) {
    const { data: linkedAssignments = [], isLoading } = useAssignmentsByLesson(lessonId);
    const { data: libraryAssignments = [] } = useAllIndependentAssignments();
    const linkMutation = useLinkAssignmentToLesson();
    const unlinkMutation = useUnlinkAssignmentFromLesson();
    const createMutation = useCreateIndependentAssignment();

    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [assignmentToUnlink, setAssignmentToUnlink] = useState<AssignmentResponse | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter library assignments that are not already linked
    const linkedIds = new Set(linkedAssignments.map(a => a.id));
    const availableAssignments = libraryAssignments.filter(a =>
        !linkedIds.has(a.id) &&
        (searchQuery === "" || a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleLinkAssignment = (assignment: AssignmentResponse) => {
        linkMutation.mutate({ lessonId, assignmentId: assignment.id }, {
            onSuccess: () => setShowLinkModal(false),
        });
    };

    const handleUnlinkAssignment = () => {
        if (assignmentToUnlink) {
            unlinkMutation.mutate({ lessonId, assignmentId: assignmentToUnlink.id }, {
                onSuccess: () => setAssignmentToUnlink(null),
            });
        }
    };

    const handleCreateAssignment = (data: { title: string; description?: string; dueDate?: string; totalPoints?: number }) => {
        const payload: AssignmentRequest = {
            title: data.title,
            assignmentType: "HOMEWORK",
            description: data.description,
            dueDate: formatToInstant(data.dueDate || ""),
            totalPoints: data.totalPoints,
        };
        createMutation.mutate(payload, {
            onSuccess: () => setShowCreateModal(false),
        });
    };

    if (isLoading) {
        return (
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50">
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-500/20 dark:to-blue-500/20 rounded-xl">
                        <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white">Assignments</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {linkedAssignments.length} assignment{linkedAssignments.length !== 1 ? "s" : ""} linked
                        </p>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 border-0">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Assignment
                            <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setShowLinkModal(true)}>
                            <Link2 className="h-4 w-4 mr-2" />
                            Link from Library
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowCreateModal(true)}>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Create New
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Linked Assignments List */}
            {linkedAssignments.length === 0 ? (
                <Card className="bg-white dark:bg-slate-800/50 border-dashed border-slate-300 dark:border-slate-600">
                    <CardContent className="py-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8 text-slate-400" />
                        </div>
                        <h4 className="font-semibold text-slate-800 dark:text-white mb-2">No Assignments</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Link an assignment from your library or create a new one.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {linkedAssignments.map((assignment) => {
                        const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
                        const isOverdue = dueDate && dueDate < new Date();

                        return (
                            <Card key={assignment.id} className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                                <CardContent className="py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl">
                                                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-slate-800 dark:text-white">
                                                        {assignment.title}
                                                    </h4>
                                                    {isOverdue ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400">
                                                            <AlertCircle className="h-3 w-3" />
                                                            Overdue
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                                    {dueDate && (
                                                        <span className={`flex items-center gap-1 ${isOverdue ? "text-red-500" : ""}`}>
                                                            <Calendar className="h-3 w-3" />
                                                            {format(dueDate, "MMM d")}
                                                        </span>
                                                    )}
                                                    {assignment.totalPoints && (
                                                        <span className="flex items-center gap-1">
                                                            <Target className="h-3 w-3" />
                                                            {assignment.totalPoints} pts
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setAssignmentToUnlink(assignment)}
                                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Unlink2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Link from Library Modal */}
            <Dialog open={showLinkModal} onOpenChange={setShowLinkModal}>
                <DialogContent className="max-w-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl">
                                <Link2 className="h-5 w-5 text-white" />
                            </div>
                            Link Assignment
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400">
                            Select an assignment from your library to link to this lesson.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search assignments..."
                                className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                        </div>

                        <div className="max-h-64 overflow-y-auto space-y-2">
                            {availableAssignments.length === 0 ? (
                                <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                                    {libraryAssignments.length === 0
                                        ? "No assignments in your library."
                                        : "No matching assignments found."}
                                </div>
                            ) : (
                                availableAssignments.map((assignment) => (
                                    <button
                                        key={assignment.id}
                                        onClick={() => handleLinkAssignment(assignment)}
                                        disabled={linkMutation.isPending}
                                        className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl border border-slate-200 dark:border-slate-700 text-left transition-colors"
                                    >
                                        <div className="p-2 bg-white dark:bg-slate-700 rounded-lg">
                                            <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-800 dark:text-white truncate">
                                                {assignment.title}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {assignment.totalPoints || 0} pts • Updated {formatDistanceToNow(new Date(assignment.updatedAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Create New Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            Quick Create Assignment
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400">
                            Create a new assignment for this lesson.
                        </DialogDescription>
                    </DialogHeader>

                    <QuickCreateForm
                        onSubmit={handleCreateAssignment}
                        isLoading={createMutation.isPending}
                        onCancel={() => setShowCreateModal(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Unlink Confirmation */}
            <AlertDialog open={!!assignmentToUnlink} onOpenChange={(open) => !open && setAssignmentToUnlink(null)}>
                <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-xl">
                                <Unlink2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            Unlink Assignment
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
                            This will remove "{assignmentToUnlink?.title}" from this lesson. The assignment and all submissions will remain in your library.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-slate-200 dark:border-slate-700">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleUnlinkAssignment}
                            disabled={unlinkMutation.isPending}
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                        >
                            {unlinkMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Unlink2 className="mr-2 h-4 w-4" />
                            )}
                            Unlink
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// Quick Create Form Component
function QuickCreateForm({
    onSubmit,
    isLoading,
    onCancel,
}: {
    onSubmit: (data: { title: string; description?: string; dueDate?: string; totalPoints?: number }) => void;
    isLoading: boolean;
    onCancel: () => void;
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [totalPoints, setTotalPoints] = useState(100);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, description, dueDate, totalPoints });
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Title *</Label>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Assignment title..."
                    required
                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">Description</Label>
                <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description..."
                    rows={2}
                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300">Due Date</Label>
                    <Input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-700 dark:text-slate-300">Total Points</Label>
                    <Input
                        type="number"
                        min={0}
                        value={totalPoints}
                        onChange={(e) => setTotalPoints(Number(e.target.value))}
                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    />
                </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={!title.trim() || isLoading} className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 border-0">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Create
                </Button>
            </div>
        </form>
    );
}

export default LessonAssignmentManager;
