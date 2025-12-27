"use client";

import React from "react";
import { QuizType, QuizStatus } from "@/services/assessment/assessment.types";
import { Clock, Trophy, Shuffle, Eye } from "lucide-react";

interface QuizFormData {
    title: string;
    description?: string;
    instructions?: string;
    quizType: QuizType;
    timeLimit?: number;
    passingScore?: number;
    maxAttempts?: number;
    shuffleQuestions?: boolean;
    showCorrectAnswers?: boolean;
    status?: QuizStatus;
}

interface QuizFormProps {
    formData: QuizFormData;
    onChange: (field: keyof QuizFormData, value: any) => void;
    error?: string | null;
}

export function QuizForm({ formData, onChange, error }: QuizFormProps) {
    return (
        <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Basic Information
                </h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quiz Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => onChange("title", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., Chapter 1 Quiz"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => onChange("description", e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Brief description of the quiz..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Instructions
                        </label>
                        <textarea
                            value={formData.instructions}
                            onChange={(e) => onChange("instructions", e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Provide instructions for students taking this quiz..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quiz Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.quizType}
                                onChange={(e) =>
                                    onChange("quizType", e.target.value as QuizType)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="PRACTICE">Practice</option>
                                <option value="GRADED">Graded</option>
                                <option value="FINAL">Final Exam</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) =>
                                    onChange("status", e.target.value as QuizStatus)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="ARCHIVED">Archived</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-600" />
                    Quiz Settings
                </h2>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <Clock className="h-4 w-4 mr-1" />
                                Time Limit (minutes)
                            </label>
                            <input
                                type="number"
                                value={formData.timeLimit || ""}
                                onChange={(e) =>
                                    onChange(
                                        "timeLimit",
                                        e.target.value ? Number(e.target.value) : undefined
                                    )
                                }
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Optional"
                            />
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                <Trophy className="h-4 w-4 mr-1" />
                                Passing Score (%)
                            </label>
                            <input
                                type="number"
                                value={formData.passingScore || ""}
                                onChange={(e) =>
                                    onChange(
                                        "passingScore",
                                        e.target.value ? Number(e.target.value) : undefined
                                    )
                                }
                                min="0"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Maximum Attempts
                        </label>
                        <input
                            type="number"
                            value={formData.maxAttempts || ""}
                            onChange={(e) =>
                                onChange(
                                    "maxAttempts",
                                    e.target.value ? Number(e.target.value) : undefined
                                )
                            }
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Unlimited"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={formData.shuffleQuestions}
                                onChange={(e) =>
                                    onChange("shuffleQuestions", e.target.checked)
                                }
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700 flex items-center">
                                <Shuffle className="h-4 w-4 mr-1" />
                                Shuffle Questions
                            </span>
                        </label>

                        <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={formData.showCorrectAnswers}
                                onChange={(e) =>
                                    onChange("showCorrectAnswers", e.target.checked)
                                }
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700 flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                Show Correct Answers After Submission
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
