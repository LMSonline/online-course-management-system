"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuizResponse, QuizRequest } from "@/services/assessment/assessment.types";
import { useUpdateQuiz } from "@/hooks/teacher/useQuizManagement";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/core/components/ui/Card";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import Textarea from "@/core/components/ui/Textarea";
import Label from "@/core/components/ui/Label";
import Switch from "@/core/components/ui/Switch";
import {
    Save,
    Loader2,
    Clock,
    Target,
    RefreshCcw,
    Shuffle,
    ListChecks,
    Settings2,
    Calendar
} from "lucide-react";

const quizSettingsSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(200),
    description: z.string().optional().nullable(),
    timeLimitMinutes: z.coerce.number().min(0).optional().nullable(),
    passingScore: z.coerce.number().min(0).max(100).optional().nullable(),
    maxAttempts: z.coerce.number().min(1).optional().nullable(),
    randomizeQuestions: z.boolean(),
    randomizeOptions: z.boolean(),
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

type QuizSettingsFormData = z.infer<typeof quizSettingsSchema>;

interface QuizSettingsTabProps {
    quiz: QuizResponse;
}

export function QuizSettingsTab({ quiz }: QuizSettingsTabProps) {
    const updateQuizMutation = useUpdateQuiz();

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        watch,
        setValue,
    } = useForm<QuizSettingsFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(quizSettingsSchema) as any,
        defaultValues: {
            title: quiz.title || "",
            description: quiz.description || "",
            timeLimitMinutes: quiz.timeLimitMinutes ?? null,
            passingScore: quiz.passingScore ?? 70,
            maxAttempts: quiz.maxAttempts ?? null,
            randomizeQuestions: quiz.randomizeQuestions ?? false,
            randomizeOptions: quiz.randomizeOptions ?? false,
            startDate: quiz.startDate ? new Date(quiz.startDate).toISOString().slice(0, 16) : null,
            endDate: quiz.endDate ? new Date(quiz.endDate).toISOString().slice(0, 16) : null,
        },
    });

    const randomizeQuestions = watch("randomizeQuestions");
    const randomizeOptions = watch("randomizeOptions");

    const onSubmit = (data: QuizSettingsFormData) => {
        const payload: QuizRequest = {
            title: data.title,
            description: data.description || undefined,
            timeLimitMinutes: data.timeLimitMinutes || undefined,
            passingScore: data.passingScore || undefined,
            maxAttempts: data.maxAttempts || undefined,
            randomizeQuestions: data.randomizeQuestions,
            randomizeOptions: data.randomizeOptions,
            startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
            endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        };
        updateQuizMutation.mutate({ id: quiz.id, payload });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info Card */}
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-xl">
                            <Settings2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Basic Information</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">
                                Set the title and description for your quiz.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-slate-700 dark:text-slate-300">
                            Quiz Title <span className="text-red-500">*</span>
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
                            placeholder="Brief overview of what this quiz covers..."
                            {...register("description")}
                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Availability Card */}
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl">
                            <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Availability</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">
                                Set when students can access this quiz.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="startDate" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                Start Date & Time
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
                                <p className="text-xs text-slate-500 dark:text-slate-400">When quiz becomes available</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <Calendar className="h-4 w-4 text-red-500" />
                                End Date & Time
                            </Label>
                            <Input
                                id="endDate"
                                type="datetime-local"
                                {...register("endDate")}
                                className={`bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${errors.endDate ? "border-red-500" : ""}`}
                            />
                            {errors.endDate && (
                                <p className="text-xs text-red-500">{errors.endDate.message}</p>
                            )}
                            {!errors.endDate && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">When quiz becomes unavailable</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quiz Settings Card */}
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
                            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Quiz Settings</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">
                                Configure time limits and passing criteria.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="timeLimitMinutes" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <Clock className="h-4 w-4 text-blue-500" />
                                Time Limit (minutes)
                            </Label>
                            <Input
                                id="timeLimitMinutes"
                                type="number"
                                min={0}
                                placeholder="No limit"
                                {...register("timeLimitMinutes")}
                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400">Leave empty for no limit</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passingScore" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <Target className="h-4 w-4 text-emerald-500" />
                                Passing Score (%)
                            </Label>
                            <Input
                                id="passingScore"
                                type="number"
                                min={0}
                                max={100}
                                placeholder="70"
                                {...register("passingScore")}
                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400">Minimum score to pass</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxAttempts" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <RefreshCcw className="h-4 w-4 text-amber-500" />
                                Max Attempts
                            </Label>
                            <Input
                                id="maxAttempts"
                                type="number"
                                min={1}
                                placeholder="Unlimited"
                                {...register("maxAttempts")}
                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400">Leave empty for unlimited</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Display Options Card */}
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-100 dark:bg-violet-500/20 rounded-xl">
                            <ListChecks className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Display Options</CardTitle>
                            <CardDescription className="text-slate-500 dark:text-slate-400">
                                Control how the quiz is presented to students.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-violet-100 dark:bg-violet-500/20 rounded-xl">
                                <Shuffle className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-800 dark:text-slate-100">
                                    Shuffle Questions
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Randomize question order for each attempt
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={randomizeQuestions}
                            onCheckedChange={(checked) => setValue("randomizeQuestions", checked, { shouldDirty: true })}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl">
                                <ListChecks className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-800 dark:text-slate-100">
                                    Shuffle Answer Options
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Randomize answer choices order
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={randomizeOptions}
                            onCheckedChange={(checked) => setValue("randomizeOptions", checked, { shouldDirty: true })}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                    type="submit"
                    disabled={updateQuizMutation.isPending || !isDirty}
                    className="min-w-[140px] bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 border-0 shadow-lg shadow-purple-500/25"
                >
                    {updateQuizMutation.isPending ? (
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
    );
}

export default QuizSettingsTab;
