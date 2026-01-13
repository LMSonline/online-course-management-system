"use client";

import React from "react";
import { AssignmentResponse } from "@/services/assignment/assignment.types";
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
import { AlertTriangle, Loader2, FileText } from "lucide-react";

interface DeleteAssignmentDialogProps {
    assignment: AssignmentResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export function DeleteAssignmentDialog({
    assignment,
    open,
    onOpenChange,
    onConfirm,
    isLoading = false,
}: DeleteAssignmentDialogProps) {
    if (!assignment) return null;

    const hasSubmissions = false; // Backend should validate on delete

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <AlertDialogHeader>
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 flex items-center justify-center">
                            <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <AlertDialogTitle className="text-lg text-slate-900 dark:text-white">Delete Assignment</AlertDialogTitle>
                            <AlertDialogDescription className="mt-1 text-slate-500 dark:text-slate-400">
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>

                <div className="my-5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
                            <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-white">
                                {assignment.title}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Warning:</strong> This action cannot be undone. Deletion will fail if submissions exist.
                    </p>
                </div>

                <AlertDialogFooter className="mt-5">
                    <AlertDialogCancel
                        disabled={isLoading}
                        className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border-0"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Assignment"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteAssignmentDialog;
