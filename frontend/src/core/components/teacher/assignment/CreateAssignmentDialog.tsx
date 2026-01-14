"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssignmentRequest } from "@/services/assignment/assignment.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/core/components/ui/Dialog";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import Textarea from "@/core/components/ui/Textarea";
import Label from "@/core/components/ui/Label";
import { Loader2, FileText, Calendar } from "lucide-react";
import {
    assignmentFormSchema,
    assignmentFormToRequest,
    type AssignmentFormValues,
} from "@/lib/validations/assignment.validation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/core/components/ui/Select";
import { AssignmentType } from "@/services/assignment/assignment.types";

interface CreateAssignmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: AssignmentRequest) => void;
    isLoading?: boolean;
}

const ASSIGNMENT_TYPE_CONFIG: Record<
    AssignmentType,
    { label: string; color: string }
> = {
    PRACTICE: { label: "Practice", color: "bg-blue-100 text-blue-800" },
    HOMEWORK: { label: "Homework", color: "bg-green-100 text-green-800" },
    PROJECT: { label: "Project", color: "bg-purple-100 text-purple-800" },
    FINAL_REPORT: { label: "Final Report", color: "bg-red-100 text-red-800" },
};

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
    } = useForm<any>({
        resolver: zodResolver(assignmentFormSchema) as any,
        defaultValues: {
            title: "",
            assignmentType: "HOMEWORK",
            description: "",
            totalPoints: "",
            timeLimitMinutes: "",
            maxAttempts: "",
            startDate: null,
            dueDate: null,
        },
    });

    const handleFormSubmit = (data: AssignmentFormValues) => {
        const payload = assignmentFormToRequest(data);
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
                            <p className="text-sm text-red-500">{errors.title.message as string}</p>
                        )}
                    </div>

                    {/* Assignment Type */}
                    <div className="space-y-2">
                        <Label htmlFor="assignmentType" className="text-slate-700 dark:text-slate-300">
                            Assignment Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            {...register("assignmentType")}
                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        >
                            {Object.entries(ASSIGNMENT_TYPE_CONFIG).map(([value, config]) => (
                                <option key={value} value={value}>
                                    {config.label}
                                </option>
                            ))}
                        </Select>
                        {errors.assignmentType && (
                            <p className="text-sm text-red-500">{errors.assignmentType.message as string}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-slate-700 dark:text-slate-300">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe the assignment objectives and requirements..."
                            rows={3}
                            {...register("description")}
                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        />
                    </div>

                    {/* Settings Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="totalPoints" className="text-slate-700 dark:text-slate-300">
                                Total Points
                            </Label>
                            <Input
                                id="totalPoints"
                                type="number"
                                min={0}
                                placeholder="100"
                                {...register("totalPoints")}
                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="timeLimitMinutes" className="text-slate-700 dark:text-slate-300">
                                Time Limit (min)
                            </Label>
                            <Input
                                id="timeLimitMinutes"
                                type="number"
                                min={1}
                                placeholder="Unlimited"
                                {...register("timeLimitMinutes")}
                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxAttempts" className="text-slate-700 dark:text-slate-300">
                                Max Attempts
                            </Label>
                            <Input
                                id="maxAttempts"
                                type="number"
                                min={1}
                                placeholder="1"
                                {...register("maxAttempts")}
                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                        </div>
                    </div>

                    {/* Availability Period */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-emerald-500" />
                            Availability Period
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="startDate" className="text-xs text-slate-600 dark:text-slate-400">Start Date & Time</Label>
                                <Input
                                    id="startDate"
                                    type="datetime-local"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setValue("startDate", value ? new Date(value) : null);
                                    }}
                                    className={`bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm ${errors.startDate ? "border-red-500 dark:border-red-500" : ""}`}
                                />
                                {errors.startDate && (
                                    <p className="text-xs text-red-500 mt-1">{errors.startDate.message as string}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="dueDate" className="text-xs text-slate-600 dark:text-slate-400">Due Date & Time</Label>
                                <Input
                                    id="dueDate"
                                    type="datetime-local"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setValue("dueDate", value ? new Date(value) : null);
                                    }}
                                    className={`bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm ${errors.dueDate ? "border-red-500 dark:border-red-500" : ""}`}
                                />
                                {errors.dueDate && (
                                    <p className="text-xs text-red-500 mt-1">{errors.dueDate.message as string}</p>
                                )}
                            </div>
                        </div>
                        {(errors.startDate || errors.dueDate) ? null : (
                            <p className="text-xs text-slate-500 dark:text-slate-400">Leave empty for no time restrictions</p>
                        )}
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
