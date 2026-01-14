"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuizRequest } from "@/services/assessment/assessment.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/core/components/ui/Dialog";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import Textarea from "@/core/components/ui/Textarea";
import Label from "@/core/components/ui/Label";
import { Loader2, Sparkles, Calendar } from "lucide-react";

const createQuizSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(200),
    description: z.string().optional(),
    timeLimitMinutes: z.coerce.number().min(0).optional().nullable(),
    passingScore: z.coerce.number().min(0).max(100).optional().nullable(),
    maxAttempts: z.coerce.number().min(1).optional().nullable(),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
}).refine(
    (data) => {
        if (data.startDate) {
            return new Date(data.startDate) > new Date();
        }
        return true;
    },
    {
        message: "Start date must be in the future",
        path: ["startDate"],
    }
).refine(
    (data) => {
        if (data.endDate) {
            return new Date(data.endDate) > new Date();
        }
        return true;
    },
    {
        message: "End date must be in the future",
        path: ["endDate"],
    }
).refine(
    (data) => {
        if (data.startDate && data.endDate) {
            return new Date(data.endDate) > new Date(data.startDate);
        }
        return true;
    },
    {
        message: "End date must be after start date",
        path: ["endDate"],
    }
);

type CreateQuizFormData = z.infer<typeof createQuizSchema>;

interface CreateQuizDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: QuizRequest) => void;
    isLoading?: boolean;
}

export function CreateQuizDialog({
    open,
    onOpenChange,
    onSubmit,
    isLoading = false,
}: CreateQuizDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateQuizFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(createQuizSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            timeLimitMinutes: null,
            passingScore: 70,
            maxAttempts: 3,
            startDate: null,
            endDate: null,
        },
    });

    const handleFormSubmit = (data: CreateQuizFormData) => {
        const payload: QuizRequest = {
            title: data.title,
            description: data.description || undefined,
            timeLimitMinutes: data.timeLimitMinutes || undefined,
            passingScore: data.passingScore || undefined,
            maxAttempts: data.maxAttempts || undefined,
            randomizeQuestions: false,
            randomizeOptions: false,
            startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
            endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
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
            <DialogContent className="max-w-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        Create New Quiz
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        Set up your quiz details. You can add questions after creation.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-slate-700 dark:text-slate-300">
                            Quiz Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g., JavaScript Fundamentals"
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
                            placeholder="What is this quiz about?"
                            rows={3}
                            {...register("description")}
                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        />
                    </div>

                    {/* Settings Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="timeLimitMinutes" className="text-slate-700 dark:text-slate-300 text-sm">Time (min)</Label>
                            <Input
                                id="timeLimitMinutes"
                                type="number"
                                min={0}
                                placeholder="∞"
                                {...register("timeLimitMinutes")}
                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passingScore" className="text-slate-700 dark:text-slate-300 text-sm">Pass Score (%)</Label>
                            <Input
                                id="passingScore"
                                type="number"
                                min={0}
                                max={100}
                                placeholder="70"
                                {...register("passingScore")}
                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxAttempts" className="text-slate-700 dark:text-slate-300 text-sm">Max Attempts</Label>
                            <Input
                                id="maxAttempts"
                                type="number"
                                min={1}
                                placeholder="3"
                                {...register("maxAttempts")}
                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                        </div>
                    </div>

                    {/* Availability */}
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
                                    {...register("startDate")}
                                    className={`bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm ${errors.startDate ? "border-red-500 dark:border-red-500" : ""}`}
                                />
                                {errors.startDate && (
                                    <p className="text-xs text-red-500 mt-1">{errors.startDate.message}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="endDate" className="text-xs text-slate-600 dark:text-slate-400">End Date & Time</Label>
                                <Input
                                    id="endDate"
                                    type="datetime-local"
                                    {...register("endDate")}
                                    className={`bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm ${errors.endDate ? "border-red-500 dark:border-red-500" : ""}`}
                                />
                            </div>
                        </div>
                        {(errors.startDate || errors.endDate) ? null : (
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
                            className="bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 border-0"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Quiz"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateQuizDialog;
