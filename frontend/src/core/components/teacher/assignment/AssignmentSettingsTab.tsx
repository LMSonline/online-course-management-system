"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AssignmentResponse, AssignmentRequest } from "@/services/assignment/assignment.types";
import { useUpdateAssignment, useExtendDueDate } from "@/hooks/teacher/useTeacherAssignment";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/core/components/ui/Card";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import Textarea from "@/core/components/ui/Textarea";
import Label from "@/core/components/ui/Label";
import Switch from "@/core/components/ui/Switch";
import {
    Save,
    Loader2,
    Calendar,
    Settings2,
    FileText,
    CalendarPlus
} from "lucide-react";
import { format } from "date-fns";

// Utility to convert datetime-local value to ISO 8601 Instant format
const formatToInstant = (dateTimeLocal: string): string | undefined => {
    if (!dateTimeLocal) return undefined;
    const date = new Date(dateTimeLocal);
    return date.toISOString();
};

// Utility to convert ISO 8601 Instant to datetime-local format
const formatToDateTimeLocal = (isoString: string | undefined): string => {
    if (!isoString) return "";
    try {
        return format(new Date(isoString), "yyyy-MM-dd'T'HH:mm");
    } catch {
        return "";
    }
};

const assignmentSettingsSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(200),
    description: z.string().optional().nullable(),
    startDate: z.string().optional().nullable(),
    dueDate: z.string().optional().nullable(),
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
        if (data.dueDate) {
            return new Date(data.dueDate) > new Date();
        }
        return true;
    },
    {
        message: "Due date must be in the future",
        path: ["dueDate"],
    }
).refine(
    (data) => {
        if (data.startDate && data.dueDate) {
            return new Date(data.dueDate) > new Date(data.startDate);
        }
        return true;
    },
    {
        message: "Due date must be after start date",
        path: ["dueDate"],
    }
);

type AssignmentSettingsFormData = z.infer<typeof assignmentSettingsSchema>;

interface AssignmentSettingsTabProps {
    assignment: AssignmentResponse;
}

export function AssignmentSettingsTab({ assignment }: AssignmentSettingsTabProps) {
    const updateMutation = useUpdateAssignment();
    const extendDueDateMutation = useExtendDueDate();
    const [newDueDate, setNewDueDate] = React.useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        watch,
        setValue,
    } = useForm<AssignmentSettingsFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(assignmentSettingsSchema) as any,
        defaultValues: {
            title: assignment.title || "",
            description: assignment.description || "",
            startDate: formatToDateTimeLocal(assignment.startDate || undefined),
            dueDate: formatToDateTimeLocal(assignment.dueDate || undefined),
        },
    });

    const onSubmit = (data: AssignmentSettingsFormData) => {
        const payload: AssignmentRequest = {
            title: data.title,
            assignmentType: assignment.assignmentType,
            description: data.description || undefined,
            startDate: formatToInstant(data.startDate || ""),
            dueDate: formatToInstant(data.dueDate || ""),
            totalPoints: assignment.totalPoints || undefined,
            timeLimitMinutes: assignment.timeLimitMinutes || undefined,
            maxAttempts: assignment.maxAttempts || undefined,
        };
        updateMutation.mutate({ id: assignment.id, payload });
    };

    const handleExtendDueDate = () => {
        if (newDueDate) {
            // Convert to ISO 8601 Instant format before sending
            const isoDate = formatToInstant(newDueDate);
            if (isoDate) {
                extendDueDateMutation.mutate({ id: assignment.id, newDueDate: isoDate });
            }
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info Card */}
                <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl">
                                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Basic Information</CardTitle>
                                <CardDescription className="text-slate-500 dark:text-slate-400">
                                    Set the title, description, and instructions.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-slate-700 dark:text-slate-300">
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                {...register("title")}
                                className={`bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${errors.title ? "border-red-500" : ""}`}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-slate-700 dark:text-slate-300">Description</Label>
                            <Textarea
                                id="description"
                                rows={3}
                                {...register("description")}
                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Settings Card */}
                <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                    <CardHeader className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
                                <Settings2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Assignment Settings</CardTitle>
                                <CardDescription className="text-slate-500 dark:text-slate-400">
                                    Configure grading and submission options.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="startDate" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Calendar className="h-4 w-4 text-emerald-500" />
                                    Start Date
                                </Label>
                                <Input
                                    id="startDate"
                                    type="datetime-local"
                                    {...register("startDate")}
                                    className={`bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${errors.startDate ? "border-red-500" : ""}`}
                                />
                                {errors.startDate && (
                                    <p className="text-xs text-red-500">{errors.startDate.message}</p>
                                )}
                                {!errors.startDate && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400">When assignment becomes available</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dueDate" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Calendar className="h-4 w-4 text-red-500" />
                                    Due Date
                                </Label>
                                <Input
                                    id="dueDate"
                                    type="datetime-local"
                                    {...register("dueDate")}
                                    className={`bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${errors.dueDate ? "border-red-500" : ""}`}
                                />
                                {errors.dueDate && (
                                    <p className="text-xs text-red-500">{errors.dueDate.message}</p>
                                )}
                                {!errors.dueDate && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Submission deadline</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex items-center justify-end">
                    <Button
                        type="submit"
                        disabled={updateMutation.isPending || !isDirty}
                        className="min-w-[140px] bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 border-0 shadow-lg shadow-indigo-500/25"
                    >
                        {updateMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>

            {/* Extend Due Date Card */}
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                <CardHeader className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-xl">
                            <CalendarPlus className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Extend Due Date</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">
                                Quickly extend the deadline for all students.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-end gap-4">
                        <div className="flex-1 space-y-2">
                            <Label className="text-slate-700 dark:text-slate-300">New Due Date</Label>
                            <Input
                                type="datetime-local"
                                value={newDueDate}
                                onChange={(e) => setNewDueDate(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                        </div>
                        <Button
                            onClick={handleExtendDueDate}
                            disabled={!newDueDate || extendDueDateMutation.isPending}
                            variant="outline"
                            className="border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        >
                            {extendDueDateMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <CalendarPlus className="mr-2 h-4 w-4" />
                            )}
                            Extend
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default AssignmentSettingsTab;
