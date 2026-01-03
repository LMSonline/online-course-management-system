"use client";

import { useForm } from "react-hook-form";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import Label from "@/core/components/ui/Label";
import Textarea from "@/core/components/ui/Textarea";
import Switch from "@/core/components/ui/Switch";
import {
    QuizRequest,
    QuizResponse,
    QuizType,
    QuizStatus,
} from "@/services/assessment/assessment.types";

interface QuizFormProps {
    initialData?: QuizResponse;
    onSubmit: (data: QuizRequest) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export function QuizForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: QuizFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<QuizRequest>({
        defaultValues: initialData || {
            title: "",
            description: "",
            instructions: "",
            quizType: "PRACTICE",
            timeLimit: 30,
            passingScore: 70,
            maxAttempts: 3,
            shuffleQuestions: true,
            showCorrectAnswers: true,
            status: "DRAFT",
        },
    });

    const quizType = watch("quizType");
    const shuffleQuestions = watch("shuffleQuestions");
    const showCorrectAnswers = watch("showCorrectAnswers");
    const status = watch("status");

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="title"
                    {...register("title", { required: "Title is required" })}
                    placeholder="Enter quiz title"
                />
                {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Enter quiz description"
                    rows={3}
                />
            </div>

            {/* Instructions */}
            <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                    id="instructions"
                    {...register("instructions")}
                    placeholder="Enter quiz instructions for students"
                    rows={4}
                />
            </div>

            {/* Quiz Type */}
            <div className="space-y-2">
                <Label>Quiz Type</Label>
                <select
                    value={quizType}
                    onChange={(e) => setValue("quizType", e.target.value as QuizType)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="PRACTICE">Practice</option>
                    <option value="GRADED">Graded</option>
                    <option value="FINAL">Final Exam</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Time Limit */}
                <div className="space-y-2">
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <Input
                        id="timeLimit"
                        type="number"
                        {...register("timeLimit", { valueAsNumber: true })}
                        placeholder="30"
                    />
                </div>

                {/* Passing Score */}
                <div className="space-y-2">
                    <Label htmlFor="passingScore">Passing Score (%)</Label>
                    <Input
                        id="passingScore"
                        type="number"
                        {...register("passingScore", { valueAsNumber: true })}
                        placeholder="70"
                        min={0}
                        max={100}
                    />
                </div>
            </div>

            {/* Max Attempts */}
            <div className="space-y-2">
                <Label htmlFor="maxAttempts">Maximum Attempts</Label>
                <Input
                    id="maxAttempts"
                    type="number"
                    {...register("maxAttempts", { valueAsNumber: true })}
                    placeholder="3"
                    min={1}
                />
            </div>

            {/* Settings Toggles */}
            <div className="space-y-4 border rounded-lg p-4">
                <h3 className="font-medium">Quiz Settings</h3>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Shuffle Questions</Label>
                        <p className="text-sm text-muted-foreground">
                            Randomize question order for each student
                        </p>
                    </div>
                    <Switch
                        checked={shuffleQuestions}
                        onCheckedChange={(checked) => setValue("shuffleQuestions", checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Show Correct Answers</Label>
                        <p className="text-sm text-muted-foreground">
                            Display correct answers after completion
                        </p>
                    </div>
                    <Switch
                        checked={showCorrectAnswers}
                        onCheckedChange={(checked) => setValue("showCorrectAnswers", checked)}
                    />
                </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
                <Label>Status</Label>
                <select
                    value={status}
                    onChange={(e) => setValue("status", e.target.value as QuizStatus)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                </select>
                <p className="text-sm text-muted-foreground">
                    Only published quizzes are visible to students
                </p>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : initialData ? "Update Quiz" : "Create Quiz"}
                </Button>
            </div>
        </form>
    );
}
