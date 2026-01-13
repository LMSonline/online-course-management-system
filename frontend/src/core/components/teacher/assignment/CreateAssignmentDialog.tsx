"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssignmentRequest } from "@/services/assignment/assignment.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/core/components/ui/Dialog";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import Textarea from "@/core/components/ui/Textarea";
import Label from "@/core/components/ui/Label";
import Switch from "@/core/components/ui/Switch";
import { Loader2, FileText, Calendar } from "lucide-react";

// Utility to convert datetime-local value to ISO 8601 Instant format
const formatToInstant = (dateTimeLocal: string): string | undefined => {
    if (!dateTimeLocal) return undefined;
    // datetime-local gives "2026-01-13T10:09", we need "2026-01-13T10:09:00Z"
    const date = new Date(dateTimeLocal);
    return date.toISOString(); // Returns "2026-01-13T03:09:00.000Z"
};

const createAssignmentSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(200),
    description: z.string().optional(),
    instructions: z.string().optional(),
    dueDate: z.string().optional(),
    maxScore: z.number().min(0).default(100),
    allowLateSubmission: z.boolean(),
});

type CreateAssignmentFormData = z.infer<typeof createAssignmentSchema>;

interface CreateAssignmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: AssignmentRequest) => void;
    isLoading?: boolean;
}

export function CreateAssignmentDialog({
    open,
    onOpenChange,
    onSubmit,
    isLoading = false,
}: CreateAssignmentDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
        setValue,
    } = useForm<CreateAssignmentFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(createAssignmentSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            instructions: "",
            dueDate: "",
            maxScore: 100,
            allowLateSubmission: true,
        },
    });

    const allowLateSubmission = watch("allowLateSubmission");

    const handleFormSubmit = (data: CreateAssignmentFormData) => {
        const payload: AssignmentRequest = {
            title: data.title,
            description: data.description || undefined,
            instructions: data.instructions || undefined,
            dueDate: formatToInstant(data.dueDate || ""),
            maxScore: data.maxScore || undefined,
            allowLateSubmission: data.allowLateSubmission,
        };
        onSubmit(payload);
    };

    React.useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        Create New Assignment
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Create an assignment in your library. You can link it to lessons later.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-slate-700 dark:text-slate-300">
                            Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g., Build a REST API Project"
                            {...register("title")}
                            className={`bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${errors.title ? "border-red-500 dark:border-red-500" : ""}`}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-slate-700 dark:text-slate-300">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Brief overview of the assignment..."
                            rows={2}
                            {...register("description")}
                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        />
                    </div>

                    {/* Instructions */}
                    <div className="space-y-2">
                        <Label htmlFor="instructions" className="text-slate-700 dark:text-slate-300">Instructions</Label>
                        <Textarea
                            id="instructions"
                            placeholder="Detailed instructions for students..."
                            rows={3}
                            {...register("instructions")}
                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        />
                    </div>

                    {/* Settings Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dueDate" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                Due Date
                            </Label>
                            <Input
                                id="dueDate"
                                type="datetime-local"
                                {...register("dueDate")}
                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxScore" className="text-slate-700 dark:text-slate-300">Max Score</Label>
                            <Input
                                id="maxScore"
                                type="number"
                                min={0}
                                placeholder="100"
                                {...register("maxScore", { valueAsNumber: true })}
                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                        </div>
                    </div>

                    {/* Late Submission */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300">Late Submission</Label>
                        <div className="flex items-center gap-3 h-10">
                            <Switch
                                checked={allowLateSubmission}
                                onCheckedChange={(checked) => setValue("allowLateSubmission", checked)}
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {allowLateSubmission ? "Allowed" : "Not allowed"}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                            className="border-slate-200 dark:border-slate-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 border-0"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Assignment"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateAssignmentDialog;
