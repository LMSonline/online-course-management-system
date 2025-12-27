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
      MULTIPLE_CHOICE: "bg-blue-100 text-blue-700",
      MULTI_SELECT: "bg-purple-100 text-purple-700",
      TRUE_FALSE: "bg-green-100 text-green-700",
      SHORT_ANSWER: "bg-yellow-100 text-yellow-700",
      ESSAY: "bg-pink-100 text-pink-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push("/teacher/question-banks")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Question Banks
          </button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{bank.name}</h1>
              {bank.description && (
                <p className="mt-1 text-sm text-gray-500">{bank.description}</p>
              )}
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>{questions.length} questions</span>
                <span>
                  Created {new Date(bank.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={handleCreateQuestion}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Question
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="ALL">All Types</option>
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="MULTI_SELECT">Multi Select</option>
                <option value="TRUE_FALSE">True/False</option>
                <option value="SHORT_ANSWER">Short Answer</option>
                <option value="ESSAY">Essay</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">No questions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterType !== "ALL"
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first question"}
                </p>
                {!searchTerm && filterType === "ALL" && (
                  <div className="mt-6">
                    <button
                      onClick={handleCreateQuestion}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
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
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                              {index + 1}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                                question.type
                              )}`}
                            >
                              {getTypeLabel(question.type)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {question.maxPoints} pts
                            </span>
                          </div>
                          <p className="text-base text-gray-900 font-medium">
                            {question.content}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEditQuestion(question)}
                            className="p-2 text-gray-400 hover:text-purple-600 rounded-md transition-colors"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(question.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-md transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Answer Options */}
                      {question.answerOptions && question.answerOptions.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {question.answerOptions.map((option) => (
                            <div
                              key={option.id}
                              className={`flex items-start p-3 rounded-lg border ${option.isCorrect
                                ? "bg-green-50 border-green-200"
                                : "bg-gray-50 border-gray-200"
                                }`}
                            >
                              {option.isCorrect ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                              )}
                              <span className="text-sm text-gray-700">
                                {option.content}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Delete Confirmation */}
                    {deleteConfirm === question.id && (
                      <div className="px-6 pb-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-sm text-red-800 mb-3">
                            Are you sure you want to delete this question? This action
                            cannot be undone.
                          </p>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
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
            <div className="sticky top-24">
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
