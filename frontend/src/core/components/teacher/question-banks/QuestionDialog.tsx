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
    const [formData, setFormData] = useState<QuestionRequest>({
        content: question?.content || "",
        type: question?.type || "MULTIPLE_CHOICE",
        maxPoints: question?.maxPoints || 1,
        metadata: question?.metadata || "",
        answerOptions: question?.answerOptions?.map((opt) => ({
            content: opt.content,
            correct: opt.correct,
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
                        { content: "", correct: false, orderIndex: 0 },
                        { content: "", correct: false, orderIndex: 1 },
                        { content: "", correct: false, orderIndex: 2 },
                        { content: "", correct: false, orderIndex: 3 },
                    ],
                }));
            } else if (formData.type === "TRUE_FALSE") {
                setFormData((prev) => ({
                    ...prev,
                    answerOptions: [
                        { content: "True", correct: false, orderIndex: 0 },
                        { content: "False", correct: false, orderIndex: 1 },
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
                    { content: "", correct: false, orderIndex: 0 },
                    { content: "", correct: false, orderIndex: 1 },
                    { content: "", correct: false, orderIndex: 2 },
                    { content: "", correct: false, orderIndex: 3 },
                ];
            } else if (type === "TRUE_FALSE") {
                answerOptions = [
                    { content: "True", correct: false, orderIndex: 0 },
                    { content: "False", correct: false, orderIndex: 1 },
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
                    correct: false,
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
            if (field === "correct" && value && prev.type === "MULTIPLE_CHOICE") {
                newOptions.forEach((opt, i) => {
                    if (i !== index) opt.correct = false;
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
            const hasCorrect = formData.answerOptions.some((opt) => opt.correct);
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
            } else {
                await assessmentService.createQuestion(bankId, formData);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save question");
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
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    onClick={onClose}
                />

                {/* Dialog */}
                <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 z-10">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {question ? "Edit Question" : "Add Question"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Question Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Question Type <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
                                    { value: "MULTI_SELECT", label: "Multi Select" },
                                    { value: "TRUE_FALSE", label: "True/False" },
                                    { value: "SHORT_ANSWER", label: "Short Answer" },
                                    { value: "ESSAY", label: "Essay" },
                                ].map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => handleTypeChange(type.value as QuestionType)}
                                        className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-colors ${formData.type === type.value
                                            ? "border-purple-600 bg-purple-50 text-purple-700"
                                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
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
                                className="block text-sm font-medium text-gray-700 mb-1"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter your question..."
                                required
                            />
                        </div>

                        {/* Points */}
                        <div>
                            <label
                                htmlFor="maxPoints"
                                className="block text-sm font-medium text-gray-700 mb-1"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Answer Options */}
                        {showAnswerOptions && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Answer Options <span className="text-red-500">*</span>
                                    </label>
                                    {formData.type !== "TRUE_FALSE" && (
                                        <button
                                            type="button"
                                            onClick={handleAddOption}
                                            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
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
                                                    handleOptionChange(index, "correct", !option.correct)
                                                }
                                                className={`mt-2 flex-shrink-0 ${option.correct
                                                    ? "text-green-600"
                                                    : "text-gray-300 hover:text-gray-400"
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
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                disabled={formData.type === "TRUE_FALSE"}
                                            />
                                            {formData.type !== "TRUE_FALSE" &&
                                                formData.answerOptions &&
                                                formData.answerOptions.length > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveOption(index)}
                                                        className="mt-2 text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                )}
                                        </div>
                                    ))}
                                </div>

                                <p className="mt-2 text-xs text-gray-500">
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
                                className="block text-sm font-medium text-gray-700 mb-1"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder='e.g., {"difficulty": "medium", "topic": "algorithms"}'
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Add extra information like difficulty level, topic, etc.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
