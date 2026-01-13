"use client";

import { useForm } from "react-hook-form";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import Label from "@/core/components/ui/Label";
import Textarea from "@/core/components/ui/Textarea";
import Switch from "@/core/components/ui/Switch";
import {
    AssignmentRequest,
    AssignmentResponse,
} from "@/services/assignment/assignment.types";

// Utility to convert datetime-local value to ISO 8601 Instant format
const formatToInstant = (dateTimeLocal: string): string | undefined => {
    if (!dateTimeLocal) return undefined;
    const date = new Date(dateTimeLocal);
    return date.toISOString();
};

interface AssignmentFormProps {
    initialData?: AssignmentResponse;
    onSubmit: (data: AssignmentRequest) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export function AssignmentForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: AssignmentFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<AssignmentRequest>({
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            dueDate: initialData?.dueDate || "",
        },
    });

    const handleFormSubmit = (data: AssignmentRequest) => {
        const payload: AssignmentRequest = {
            title: data.title,
            assignmentType: data.assignmentType,
            description: data.description || undefined,
            dueDate: formatToInstant(data.dueDate || ""),
            totalPoints: data.totalPoints || undefined,
            timeLimitMinutes: data.timeLimitMinutes || undefined,
            maxAttempts: data.maxAttempts || undefined,
        };
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="title"
                    {...register("title", { required: "Title is required" })}
                    placeholder="Enter assignment title"
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
                    placeholder="Enter assignment description"
                    rows={4}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Due Date */}
                <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                        id="dueDate"
                        type="datetime-local"
                        {...register("dueDate", {
                            validate: (value) => {
                                if (!value) return true;
                                const dueDate = new Date(value);
                                const now = new Date();
                                if (dueDate <= now) {
                                    return "Due date must be in the future";
                                }
                                return true;
                            },
                        })}
                    />
                    {errors.dueDate && (
                        <p className="text-sm text-red-500">{errors.dueDate.message}</p>
                    )}
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                        ? "Saving..."
                        : initialData
                            ? "Update Assignment"
                            : "Create Assignment"}
                </Button>
            </div>
        </form>
    );
}
