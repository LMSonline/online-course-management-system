"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { assessmentService } from "@/services/assessment/assessment.service";
import {
    QuizRequest,
    QuizResponse,
    QuestionBankResponse,
    QuestionResponse,
    QuizType,
    QuizStatus,
} from "@/services/assessment/assessment.types";
import { useTeacherId } from "@/hooks/useProfile";
import { QuizForm } from "@/core/components/teacher/quizzes";
import {
    ArrowLeft,
    Plus,
    X,
    Search,
    CheckCircle2,
} from "lucide-react";

export default function CreateEditQuizPage() {
    const router = useRouter();
    const params = useParams();
    const teacherId = useTeacherId();
    const quizId = params?.id ? Number(params.id) : null;
    const isEditMode = !!quizId;

    const [formData, setFormData] = useState<QuizRequest>({
        title: "",
        description: "",
        instructions: "",
        quizType: "PRACTICE",
        timeLimit: undefined,
        passingScore: 70,
        maxAttempts: undefined,
        shuffleQuestions: false,
        showCorrectAnswers: true,
        status: "DRAFT",
    });

    const [lessonId, setLessonId] = useState<number>(1); // This should come from parent lesson context
    const [questionBanks, setQuestionBanks] = useState<QuestionBankResponse[]>([]);
    const [selectedBank, setSelectedBank] = useState<number | null>(null);
    const [availableQuestions, setAvailableQuestions] = useState<QuestionResponse[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (teacherId) {
            loadQuestionBanks();
        }
        if (isEditMode && quizId) {
            loadQuizData();
        }
    }, [teacherId, quizId]);

    useEffect(() => {
        if (selectedBank) {
            loadQuestions(selectedBank);
        }
    }, [selectedBank]);

    const loadQuestionBanks = async () => {
        if (!teacherId) return;

        try {
            const banks = await assessmentService.getQuestionBanksByTeacher(teacherId);
            setQuestionBanks(banks);
        } catch (error) {
            console.error("Failed to load question banks:", error);
        }
    };

    const loadQuizData = async () => {
        if (!quizId) return;
        try {
            setLoading(true);
            const quiz = await assessmentService.getQuizById(quizId);
            setFormData({
                title: quiz.title,
                description: quiz.description,
                instructions: quiz.instructions,
                quizType: quiz.quizType,
                timeLimit: quiz.timeLimit,
                passingScore: quiz.passingScore,
                maxAttempts: quiz.maxAttempts,
                shuffleQuestions: quiz.shuffleQuestions,
                showCorrectAnswers: quiz.showCorrectAnswers,
                status: quiz.status,
            });
            // Load selected questions would require an API endpoint
        } catch (error) {
            console.error("Failed to load quiz:", error);
            setError("Failed to load quiz data");
        } finally {
            setLoading(false);
        }
    };

    const loadQuestions = async (bankId: number) => {
        try {
            const questions = await assessmentService.getQuestionsByBank(bankId);
            setAvailableQuestions(questions);
        } catch (error) {
            console.error("Failed to load questions:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isEditMode && quizId) {
                await assessmentService.updateQuiz(quizId, formData);
                if (selectedQuestions.length > 0) {
                    await assessmentService.addQuestionsToQuiz(quizId, {
                        questionIds: selectedQuestions,
                    });
                }
            } else {
                const quiz = await assessmentService.createQuiz(lessonId, formData);
                if (selectedQuestions.length > 0) {
                    await assessmentService.addQuestionsToQuiz(quiz.id, {
                        questionIds: selectedQuestions,
                    });
                }
            }
            router.push("/teacher/quizzes");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save quiz");
        } finally {
            setLoading(false);
        }
    };

    const toggleQuestion = (questionId: number) => {
        setSelectedQuestions((prev) =>
            prev.includes(questionId)
                ? prev.filter((id) => id !== questionId)
                : [...prev, questionId]
        );
    };

    const filteredQuestions = availableQuestions.filter((q) =>
        q.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => router.push("/teacher/quizzes")}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Quizzes
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900">
                        {isEditMode ? "Edit Quiz" : "Create New Quiz"}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Set up your quiz and select questions from your question banks
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <QuizForm
                            formData={formData}
                            onChange={(field, value) => setFormData({ ...formData, [field]: value })}
                            error={error}
                        />

                        {/* Question Selection */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Select Questions
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Question Bank
                                    </label>
                                    <select
                                        value={selectedBank || ""}
                                        onChange={(e) =>
                                            setSelectedBank(
                                                e.target.value ? Number(e.target.value) : null
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="">Select a question bank...</option>
                                        {questionBanks.map((bank) => (
                                            <option key={bank.id} value={bank.id}>
                                                {bank.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedBank && (
                                    <>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Search questions..."
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="max-h-96 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-4">
                                            {filteredQuestions.map((question) => (
                                                <label
                                                    key={question.id}
                                                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedQuestions.includes(question.id)}
                                                        onChange={() => toggleQuestion(question.id)}
                                                        className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-900">
                                                            {question.content}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {question.type} • {question.maxPoints} pts
                                                        </p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Questions Selected:</span>
                                    <span className="font-medium">{selectedQuestions.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Quiz Type:</span>
                                    <span className="font-medium">{formData.quizType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className="font-medium">{formData.status}</span>
                                </div>
                                {formData.timeLimit && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Time Limit:</span>
                                        <span className="font-medium">{formData.timeLimit} min</span>
                                    </div>
                                )}
                                {formData.passingScore && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Passing Score:</span>
                                        <span className="font-medium">{formData.passingScore}%</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 space-y-3">
                                <button
                                    type="submit"
                                    disabled={loading || !formData.title}
                                    className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading
                                        ? "Saving..."
                                        : isEditMode
                                            ? "Update Quiz"
                                            : "Create Quiz"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push("/teacher/quizzes")}
                                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
