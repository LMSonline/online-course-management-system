"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/core/components/ui/Dialog";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import Label from "@/core/components/ui/Label";
import { Loader2, Search, Link2, ClipboardList, Calendar, Target } from "lucide-react";
import { toast } from "sonner";
import { assignmentService } from "@/services/assignment";
import { AssignmentResponse } from "@/services/assignment/assignment.types";

interface LinkAssignmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lessonId: number;
    onLinkSuccess?: () => void;
}

export function LinkAssignmentDialog({
    open,
    onOpenChange,
    lessonId,
    onLinkSuccess,
}: LinkAssignmentDialogProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAssignment, setSelectedAssignment] = useState<AssignmentResponse | null>(null);
    const [isLinking, setIsLinking] = useState(false);

    // Fetch all independent assignments
    const { data: assignments = [], isLoading } = useQuery<AssignmentResponse[]>({
        queryKey: ["independent-assignments"],
        queryFn: () => assignmentService.getAllIndependentAssignments(),
    });

    const filteredAssignments = assignments.filter((assignment) =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLinkAssignment = async () => {
        if (!selectedAssignment) {
            toast.error("Please select an assignment to link");
            return;
        }

        setIsLinking(true);
        try {
            await assignmentService.linkAssignmentToLesson(lessonId, selectedAssignment.id);
            toast.success(`Assignment "${selectedAssignment.title}" linked successfully!`);
            onLinkSuccess?.();
            onOpenChange(false);
            setSelectedAssignment(null);
            setSearchTerm("");
        } catch (error: any) {
            toast.error(error?.message || "Failed to link assignment");
        } finally {
            setIsLinking(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                            <Link2 className="h-5 w-5 text-white" />
                        </div>
                        Link Existing Assignment
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Select an assignment from your library to link to this lesson.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Search */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300">Search Assignments</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by assignment title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                        </div>
                    </div>

                    {/* Assignment List */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300">
                            Available Assignments ({filteredAssignments.length})
                        </Label>
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                                </div>
                            ) : filteredAssignments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <ClipboardList className="h-12 w-12 text-slate-400 mb-3" />
                                    <p className="text-slate-500 dark:text-slate-400">
                                        {searchTerm ? "No assignments match your search" : "No independent assignments available"}
                                    </p>
                                </div>
                            ) : (
                                <div className="max-h-[400px] overflow-y-auto">
                                    {filteredAssignments.map((assignment) => (
                                        <button
                                            key={assignment.id}
                                            onClick={() => setSelectedAssignment(assignment)}
                                            className={`w-full text-left p-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0 transition-colors ${selectedAssignment?.id === assignment.id
                                                    ? "bg-amber-50 dark:bg-amber-950/30 border-l-4 border-l-amber-500"
                                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                                }`}
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-start justify-between gap-3">
                                                    <h4 className="font-semibold text-slate-900 dark:text-white">
                                                        {assignment.title}
                                                    </h4>
                                                    {selectedAssignment?.id === assignment.id && (
                                                        <div className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded">
                                                            Selected
                                                        </div>
                                                    )}
                                                </div>
                                                {assignment.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                                        {assignment.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                                    {assignment.totalPoints && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Target className="h-3.5 w-3.5" />
                                                            {assignment.totalPoints} points
                                                        </span>
                                                    )}
                                                    {assignment.maxAttempts && (
                                                        <span>
                                                            Max {assignment.maxAttempts} attempts
                                                        </span>
                                                    )}
                                                </div>
                                                {(assignment.startDate || assignment.dueDate) && (
                                                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {assignment.startDate && (
                                                            <span>From: {formatDate(assignment.startDate)}</span>
                                                        )}
                                                        {assignment.dueDate && (
                                                            <span>Due: {formatDate(assignment.dueDate)}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                setSelectedAssignment(null);
                                setSearchTerm("");
                            }}
                            disabled={isLinking}
                            className="border-slate-200 dark:border-slate-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleLinkAssignment}
                            disabled={!selectedAssignment || isLinking}
                            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 border-0"
                        >
                            {isLinking ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Linking...
                                </>
                            ) : (
                                <>
                                    <Link2 className="mr-2 h-4 w-4" />
                                    Link Assignment
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
