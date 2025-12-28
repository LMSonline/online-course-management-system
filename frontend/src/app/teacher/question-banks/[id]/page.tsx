"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { assessmentService } from "@/services/assessment/assessment.service";
import {
  QuestionBankResponse,
  QuestionResponse,
  QuestionType,
} from "@/services/assessment/assessment.types";
import {
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Filter,
  ChevronDown,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { QuestionDialog, QuestionBankStats } from "@/core/components/teacher/question-banks";

export default function QuestionBankDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bankId = Number(params.id);

  const [bank, setBank] = useState<QuestionBankResponse | null>(null);
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<QuestionType | "ALL">("ALL");
  const [showDialog, setShowDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionResponse | null>(
    null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    loadBankDetails();
  }, [bankId]);

  const loadBankDetails = async () => {
    try {
      setLoading(true);
      const [bankData, questionsData] = await Promise.all([
        assessmentService.getQuestionBankById(bankId),
        assessmentService.getQuestionsByBank(bankId),
      ]);
      setBank(bankData);
      setQuestions(questionsData);
    } catch (error) {
      console.error("Failed to load question bank:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setShowDialog(true);
  };

  const handleEditQuestion = (question: QuestionResponse) => {
    setEditingQuestion(question);
    setShowDialog(true);
  };

  const handleDeleteQuestion = async (id: number) => {
    try {
      await assessmentService.deleteQuestion(id);
      setQuestions(questions.filter((q) => q.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };

  const handleDialogSuccess = () => {
    setShowDialog(false);
    setEditingQuestion(null);
    loadBankDetails();
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.content
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || q.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: QuestionType) => {
    const colors = {
      MULTIPLE_CHOICE: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
      MULTI_SELECT: "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800",
      TRUE_FALSE: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
      SHORT_ANSWER: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
      ESSAY: "bg-pink-100 dark:bg-pink-950/30 text-pink-700 dark:text-pink-400 border border-pink-200 dark:border-pink-800",
    };
    return colors[type] || "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700";
  };

  const getTypeLabel = (type: QuestionType) => {
    const labels = {
      MULTIPLE_CHOICE: "Multiple Choice",
      MULTI_SELECT: "Multi Select",
      TRUE_FALSE: "True/False",
      SHORT_ANSWER: "Short Answer",
      ESSAY: "Essay",
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!bank) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Question Bank Not Found
          </h2>
          <button
            onClick={() => router.push("/teacher/question-banks")}
            className="mt-4 text-purple-600 hover:text-purple-700"
          >
            Back to Question Banks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <button
            onClick={() => router.push("/teacher/question-banks")}
            className="flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Question Banks
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                {bank.name}
              </h1>
              {bank.description && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {bank.description}
                </p>
              )}
              <div className="mt-2 flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                <span className="font-medium">{questions.length} questions</span>
                <span className="hidden sm:inline">•</span>
                <span>
                  Created {new Date(bank.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={handleCreateQuestion}
              className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors whitespace-nowrap"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Question
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>

            <div className="relative sm:w-auto">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="appearance-none w-full sm:w-auto px-4 py-2.5 pr-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="MULTI_SELECT">Multi Select</option>
                <option value="TRUE_FALSE">True/False</option>
                <option value="SHORT_ANSWER">Short Answer</option>
                <option value="ESSAY">Essay</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12 md:py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400 dark:text-slate-600 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  No questions found
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  {searchTerm || filterType !== "ALL"
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first question"}
                </p>
                {!searchTerm && filterType === "ALL" && (
                  <div className="mt-6">
                    <button
                      onClick={handleCreateQuestion}
                      className="inline-flex items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Question
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2 mb-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">
                              {index + 1}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                                question.type
                              )}`}
                            >
                              {getTypeLabel(question.type)}
                            </span>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              {question.maxPoints} pts
                            </span>
                          </div>
                          <p className="text-base text-slate-900 dark:text-white font-medium leading-relaxed break-words">
                            {question.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 sm:ml-4 self-start">
                          <button
                            onClick={() => handleEditQuestion(question)}
                            className="p-2 text-slate-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950 rounded-lg transition-colors"
                            title="Edit question"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(question.id)}
                            className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                            title="Delete question"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Answer Options */}
                      {question.answerOptions && question.answerOptions.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                            Answer Options
                          </div>
                          {question.answerOptions.map((option, optIndex) => (
                            <div
                              key={option.id}
                              className={`flex items-start p-3 rounded-lg border-2 transition-all ${option.correct
                                ? "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-500 dark:border-emerald-500 shadow-sm"
                                : "bg-white dark:bg-slate-800/50 border-slate-300 dark:border-slate-700"
                                }`}
                            >
                              <div className="flex items-start flex-1 min-w-0">
                                {/* Option Letter */}
                                <span className={`flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold mr-3 flex-shrink-0 ${option.correct
                                  ? "bg-emerald-500 dark:bg-emerald-600 text-white"
                                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                                  }`}>
                                  {String.fromCharCode(65 + optIndex)}
                                </span>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start gap-2">
                                    <span className={`text-sm break-words ${option.correct
                                      ? "text-slate-900 dark:text-white font-medium"
                                      : "text-slate-700 dark:text-slate-300"
                                      }`}>
                                      {option.content}
                                    </span>
                                  </div>
                                  {option.correct && (
                                    <div className="flex items-center gap-1.5 mt-2">
                                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                                        Correct Answer
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Delete Confirmation */}
                    {deleteConfirm === question.id && (
                      <div className="px-4 md:px-6 pb-4 md:pb-6">
                        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                          <p className="text-sm text-red-800 dark:text-red-300 mb-3">
                            Are you sure you want to delete this question? This action
                            cannot be undone.
                          </p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-lg transition-colors"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Stats */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <QuestionBankStats questions={questions} />
            </div>
          </div>
        </div>
      </div>

      {/* Question Dialog */}
      {showDialog && (
        <QuestionDialog
          bankId={bankId}
          question={editingQuestion}
          onClose={() => {
            setShowDialog(false);
            setEditingQuestion(null);
          }}
          onSuccess={handleDialogSuccess}
        />
      )}
    </div>
  );
}
