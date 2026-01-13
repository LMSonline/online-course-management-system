"use client";

import React, { useState, useEffect } from "react";
import { assessmentService } from "@/services/assessment/assessment.service";
import {
    QuestionRequest,
    QuestionResponse,
    QuestionType,
    AnswerOptionRequest,
} from "@/services/assessment/assessment.types";
import { X, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface QuestionDialogProps {
    bankId: number;
    question?: QuestionResponse | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function QuestionDialog({
    bankId,
    question,
    onClose,
    onSuccess,
}: QuestionDialogProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<QuestionRequest>({
        content: question?.content || "",
        type: question?.type || "MULTIPLE_CHOICE",
        maxPoints: question?.maxPoints || 1,
        metadata: question?.metadata || "",
        answerOptions: question?.answerOptions?.map((opt) => ({
            content: opt.content,
            isCorrect: opt.isCorrect,
            orderIndex: opt.orderIndex,
        })) || [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize answer options based on question type only on mount
    useEffect(() => {
        if (!question && (!formData.answerOptions || formData.answerOptions.length === 0)) {
            if (formData.type === "MULTIPLE_CHOICE" || formData.type === "MULTI_SELECT") {
                setFormData((prev) => ({
                    ...prev,
                    answerOptions: [
                        { content: "", isCorrect: false, orderIndex: 0 },
                        { content: "", isCorrect: false, orderIndex: 1 },
                        { content: "", isCorrect: false, orderIndex: 2 },
                        { content: "", isCorrect: false, orderIndex: 3 },
                    ],
                }));
            } else if (formData.type === "TRUE_FALSE") {
                setFormData((prev) => ({
                    ...prev,
                    answerOptions: [
                        { content: "True", isCorrect: false, orderIndex: 0 },
                        { content: "False", isCorrect: false, orderIndex: 1 },
                    ],
                }));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTypeChange = (type: QuestionType) => {
        setFormData((prev) => {
            let answerOptions: AnswerOptionRequest[] = [];

            if (type === "MULTIPLE_CHOICE" || type === "MULTI_SELECT") {
                answerOptions = [
                    { content: "", isCorrect: false, orderIndex: 0 },
                    { content: "", isCorrect: false, orderIndex: 1 },
                    { content: "", isCorrect: false, orderIndex: 2 },
                    { content: "", isCorrect: false, orderIndex: 3 },
                ];
            } else if (type === "TRUE_FALSE") {
                answerOptions = [
                    { content: "True", isCorrect: false, orderIndex: 0 },
                    { content: "False", isCorrect: false, orderIndex: 1 },
                ];
            }

            return { ...prev, type, answerOptions };
        });
    };

    const handleAddOption = () => {
        setFormData((prev) => ({
            ...prev,
            answerOptions: [
                ...(prev.answerOptions || []),
                {
                    content: "",
                    isCorrect: false,
                    orderIndex: prev.answerOptions?.length || 0,
                },
            ],
        }));
    };

    const handleRemoveOption = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            answerOptions: prev.answerOptions?.filter((_, i) => i !== index),
        }));
    };

    const handleOptionChange = (
        index: number,
        field: keyof AnswerOptionRequest,
        value: any
    ) => {
        setFormData((prev) => {
            const newOptions = [...(prev.answerOptions || [])];
            newOptions[index] = { ...newOptions[index], [field]: value };

            // For MULTIPLE_CHOICE, only one option can be correct
            if (field === "isCorrect" && value && prev.type === "MULTIPLE_CHOICE") {
                newOptions.forEach((opt, i) => {
                    if (i !== index) opt.isCorrect = false;
                });
            }

            return { ...prev, answerOptions: newOptions };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.content.trim()) {
            setError("Question content is required");
            return;
        }

        if (
            (formData.type === "MULTIPLE_CHOICE" ||
                formData.type === "MULTI_SELECT" ||
                formData.type === "TRUE_FALSE") &&
            formData.answerOptions
        ) {
            const hasCorrect = formData.answerOptions.some((opt) => opt.isCorrect);
            if (!hasCorrect) {
                setError("At least one answer must be marked as correct");
                return;
            }

            const hasEmptyContent = formData.answerOptions.some(
                (opt) => !opt.content.trim()
            );
            if (hasEmptyContent) {
                setError("All answer options must have content");
                return;
            }
        }

        setLoading(true);

        try {
            if (question) {
                await assessmentService.updateQuestion(question.id, formData);
                toast.success("Question updated successfully");
            } else {
                await assessmentService.createQuestion(bankId, formData);
                toast.success("Question created successfully");
            }
            // Invalidate queries to refresh the list
            queryClient.invalidateQueries({ queryKey: ["questions", "bank", bankId] });
            onSuccess();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to save question";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const showAnswerOptions =
        formData.type === "MULTIPLE_CHOICE" ||
        formData.type === "MULTI_SELECT" ||
        formData.type === "TRUE_FALSE";

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                {/* Dialog */}
                <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
                    {/* Header */}
                    <div className="sticky top-0 bg-white dark:bg-slate-900 flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 z-10">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                            {question ? "Edit Question" : "Add Question"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Question Type */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Question Type <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
                                    { value: "MULTI_SELECT", label: "Multi Select" },
                                    { value: "TRUE_FALSE", label: "True/False" },
                                    { value: "FILL_BLANK", label: "Fill in Blank" },
                                    { value: "ESSAY", label: "Essay" },
                                ].map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => handleTypeChange(type.value as QuestionType)}
                                        className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-colors ${formData.type === type.value
                                            ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
                                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question Content */}
                        <div>
                            <label
                                htmlFor="content"
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                            >
                                Question <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) =>
                                    setFormData({ ...formData, content: e.target.value })
                                }
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter your question..."
                                required
                            />
                        </div>

                        {/* Points */}
                        <div>
                            <label
                                htmlFor="maxPoints"
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                            >
                                Points
                            </label>
                            <input
                                type="number"
                                id="maxPoints"
                                value={formData.maxPoints}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        maxPoints: Number(e.target.value),
                                    })
                                }
                                min="0"
                                step="0.5"
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Answer Options */}
                        {showAnswerOptions && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Answer Options <span className="text-red-500">*</span>
                                    </label>
                                    {formData.type !== "TRUE_FALSE" && (
                                        <button
                                            type="button"
                                            onClick={handleAddOption}
                                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                                        >
                                            <Plus className="h-4 w-4 inline mr-1" />
                                            Add Option
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {formData.answerOptions?.map((option, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOptionChange(index, "isCorrect", !option.isCorrect)
                                                }
                                                className={`mt-2 flex-shrink-0 transition-colors ${option.isCorrect
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500"
                                                    }`}
                                            >
                                                <CheckCircle2 className="h-6 w-6" />
                                            </button>
                                            <input
                                                type="text"
                                                value={option.content}
                                                onChange={(e) =>
                                                    handleOptionChange(index, "content", e.target.value)
                                                }
                                                placeholder={`Option ${index + 1}`}
                                                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                disabled={formData.type === "TRUE_FALSE"}
                                            />
                                            {formData.type !== "TRUE_FALSE" &&
                                                formData.answerOptions &&
                                                formData.answerOptions.length > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveOption(index)}
                                                        className="mt-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                )}
                                        </div>
                                    ))}
                                </div>

                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                    {formData.type === "MULTIPLE_CHOICE" &&
                                        "Click the checkmark to mark the correct answer"}
                                    {formData.type === "MULTI_SELECT" &&
                                        "Click checkmarks to mark multiple correct answers"}
                                    {formData.type === "TRUE_FALSE" &&
                                        "Click the checkmark to mark the correct answer"}
                                </p>
                            </div>
                        )}

                        {/* Metadata (Optional - for difficulty, tags, etc.) */}
                        <div>
                            <label
                                htmlFor="metadata"
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                            >
                                Metadata (JSON - Optional)
                            </label>
                            <input
                                type="text"
                                id="metadata"
                                value={formData.metadata}
                                onChange={(e) =>
                                    setFormData({ ...formData, metadata: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder='e.g., {"difficulty": "medium", "topic": "algorithms"}'
                            />
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Add extra information like difficulty level, topic, etc.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? "Saving..." : question ? "Update Question" : "Add Question"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
