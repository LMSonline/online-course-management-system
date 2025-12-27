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
    AssignmentStatus,
} from "@/services/assignment/assignment.types";

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
        defaultValues: initialData || {
            title: "",
            description: "",
            instructions: "",
            dueDate: "",
            maxScore: 100,
            allowLateSubmission: false,
            status: "DRAFT",
        },
    });

    const allowLateSubmission = watch("allowLateSubmission");
    const status = watch("status");

    const handleFormSubmit = (data: AssignmentRequest) => {
        // Convert dueDate to ISO string if it exists
        const payload = {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
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

            {/* Instructions */}
            <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                    id="instructions"
                    {...register("instructions")}
                    placeholder="Detailed instructions for students"
                    rows={6}
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

                {/* Max Score */}
                <div className="space-y-2">
                    <Label htmlFor="maxScore">Maximum Score</Label>
                    <Input
                        id="maxScore"
                        type="number"
                        {...register("maxScore", { valueAsNumber: true })}
                        placeholder="100"
                        min={1}
                    />
                </div>
            </div>

            {/* Settings */}
            <div className="space-y-4 border rounded-lg p-4">
                <h3 className="font-medium">Assignment Settings</h3>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Allow Late Submission</Label>
                        <p className="text-sm text-muted-foreground">
                            Students can submit after the due date
                        </p>
                    </div>
                    <Switch
                        checked={allowLateSubmission}
                        onCheckedChange={(checked) => setValue("allowLateSubmission", checked)}
                    />
                </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
                <Label>Status</Label>
                <select
                    value={status}
                    onChange={(e) => setValue("status", e.target.value as AssignmentStatus)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                </select>
                <p className="text-sm text-muted-foreground">
                    Only published assignments are visible to students
                </p>
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
