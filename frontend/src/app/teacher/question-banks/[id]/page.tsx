"use client";

import React, { useState, useMemo, useCallback } from "react";
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
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Filter,
  MoreVertical,
  Check,
  X,
  FileQuestion,
  Clock,
  Award,
  Layers,
} from "lucide-react";
import { QuestionDialog, QuestionBankStats } from "@/core/components/teacher/question-banks";
import {
  useQuestionBankById,
  useQuestionsByBank,
  useDeleteQuestion,
  useBulkDeleteQuestions,
} from "@/hooks/teacher/useQuestionBanks";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

// Type Badge Component
function TypeBadge({ type }: { type: QuestionType }) {
  const config = {
    MULTIPLE_CHOICE: {
      label: "Multiple Choice",
      className: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    },
    MULTI_SELECT: {
      label: "Multi Select",
      className: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    },
    TRUE_FALSE: {
      label: "True/False",
      className: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    },
    FILL_BLANK: {
      label: "Fill in Blank",
      className: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    },
    ESSAY: {
      label: "Essay",
      className: "bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800",
    },
  };

  const { label, className } = config[type] || {
    label: type,
    className: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${className}`}>
      {label}
    </span>
  );
}

// Question Card Component
function QuestionCard({
  question,
  index,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isDeleting,
}: {
  question: QuestionResponse;
  index: number;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div
      className={`group relative bg-white dark:bg-slate-800/50 rounded-2xl border transition-all duration-200 ${isSelected
        ? "border-indigo-400 dark:border-indigo-500 ring-2 ring-indigo-500/20"
        : "border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600"
        } ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <label className="flex-shrink-0 mt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
              className="sr-only peer"
            />
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${isSelected
              ? "bg-indigo-600 border-indigo-600"
              : "border-slate-300 dark:border-slate-600 peer-hover:border-indigo-400"
              }`}>
              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
          </label>

          {/* Question Number & Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
                {index + 1}
              </span>
              <TypeBadge type={question.type} />
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-medium">
                <Award className="w-3 h-3" />
                {question.maxPoints} pts
              </span>
            </div>

            <p className="text-base text-slate-900 dark:text-white font-medium leading-relaxed">
              {question.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              disabled={isDeleting}
              className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Edit question"
            >
              <Edit className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete question"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Answer Options */}
        {question.answerOptions && question.answerOptions.length > 0 && (
          <div className="mt-4 ml-9">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showOptions ? "rotate-180" : ""}`} />
              {showOptions ? "Hide" : "Show"} {question.answerOptions.length} answer options
            </button>

            {showOptions && (
              <div className="mt-3 space-y-2">
                {question.answerOptions.map((option, optIndex) => (
                  <div
                    key={option.id}
                    className={`flex items-start p-3 rounded-xl border transition-all ${option.isCorrect
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                      }`}
                  >
                    <span className={`flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold mr-3 flex-shrink-0 ${option.isCorrect
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                      }`}>
                      {String.fromCharCode(65 + optIndex)}
                    </span>
                    <div className="flex-1">
                      <span className={`text-sm ${option.isCorrect
                        ? "text-slate-900 dark:text-white font-medium"
                        : "text-slate-600 dark:text-slate-300"
                        }`}>
                        {option.content}
                      </span>
                      {option.isCorrect && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            Correct
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Bulk Action Bar
function BulkActionBar({
  selectedCount,
  onDelete,
  onClear,
  isDeleting,
}: {
  selectedCount: number;
  onDelete: () => void;
  onClear: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-200">
      <div className="flex items-center gap-3 px-5 py-3 bg-slate-900 dark:bg-slate-800 rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-700">
        <div className="flex items-center gap-2 text-white">
          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
            {selectedCount}
          </div>
          <span className="font-medium">selected</span>
        </div>

        <div className="w-px h-6 bg-slate-700" />

        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {isDeleting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Delete
            </>
          )}
        </button>

        <button
          onClick={onClear}
          className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmModal({
  isOpen,
  questionId,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  isOpen: boolean;
  questionId: number | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  const [checkingInUse, setCheckingInUse] = useState(false);
  const [inUseQuizzes, setInUseQuizzes] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [checkError, setCheckError] = useState(false);

  React.useEffect(() => {
    if (isOpen && questionId) {
      setCheckingInUse(true);
      setInUseQuizzes([]);
      setChecked(false);
      setCheckError(false);

      assessmentService.checkQuestionInUse(questionId)
        .then(async (response) => {
          if (response.inUse) {
            const quizzes = await assessmentService.getQuizzesUsingQuestion(questionId);
            setInUseQuizzes(quizzes.quizIds);
          }
          setChecked(true);
        })
        .catch((error) => {
          console.error('Error checking question:', error);
          setCheckError(true);
          setChecked(true);
        })
        .finally(() => {
          setCheckingInUse(false);
        });
    }
  }, [isOpen, questionId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {checkingInUse ? (
          <div className="flex flex-col items-center py-6">
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-indigo-500 animate-spin mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Checking if question is in use...</p>
          </div>
        ) : checkError ? (
          <>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  Error Checking Question
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Unable to verify if this question is in use. The question may not exist or there was a connection error.
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors"
            >
              Close
            </button>
          </>
        ) : inUseQuizzes.length > 0 ? (
          <>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  Cannot Delete Question
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This question is being used in {inUseQuizzes.length} quiz{inUseQuizzes.length > 1 ? "zes" : ""}.
                  Remove it from all quizzes before deleting.
                </p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Quiz IDs:</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-mono">
                {inUseQuizzes.join(", ")}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors"
            >
              Close
            </button>
          </>
        ) : (
          <>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  Delete Question
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Are you sure you want to delete this question? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting || !checked || checkError}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function QuestionBankDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bankId = Number(params.id);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<QuestionType | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"order" | "type" | "points">("order");
  const [showDialog, setShowDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionResponse | null>(null);
  const [deleteQuestionId, setDeleteQuestionId] = useState<number | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());

  // React Query hooks
  const { data: bank, isLoading: loadingBank } = useQuestionBankById(bankId);
  const { data: questions = [], isLoading: loadingQuestions } = useQuestionsByBank(bankId);
  const deleteMutation = useDeleteQuestion(bankId);
  const bulkDeleteMutation = useBulkDeleteQuestions(bankId);

  const loading = loadingBank || loadingQuestions;

  const filteredQuestions = useMemo(() => {
    return questions
      .filter((q) => {
        const matchesSearch = q.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "ALL" || q.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === "type") return a.type.localeCompare(b.type);
        if (sortBy === "points") return b.maxPoints - a.maxPoints;
        return a.id - b.id;
      });
  }, [questions, searchTerm, filterType, sortBy]);

  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setShowDialog(true);
  };

  const handleEditQuestion = (question: QuestionResponse) => {
    setEditingQuestion(question);
    setShowDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteQuestionId || deleteMutation.isPending) return;

    try {
      await deleteMutation.mutateAsync(deleteQuestionId);
      setDeleteQuestionId(null);
    } catch (error) {
      // Error is already handled by the mutation
      console.error('Failed to delete question:', error);
    }
  };

  const handleSelectQuestion = useCallback((questionId: number, checked: boolean) => {
    setSelectedQuestions((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(questionId);
      } else {
        next.delete(questionId);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedQuestions.size === filteredQuestions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(filteredQuestions.map((q) => q.id)));
    }
  }, [filteredQuestions, selectedQuestions.size]);

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedQuestions);
    await bulkDeleteMutation.mutateAsync(ids);
    setSelectedQuestions(new Set());
  };

  const handleDialogSuccess = () => {
    setShowDialog(false);
    setEditingQuestion(null);
  };

  // Stats
  const stats = useMemo(() => {
    const typeCount: Record<string, number> = {};
    let totalPoints = 0;
    questions.forEach((q) => {
      typeCount[q.type] = (typeCount[q.type] || 0) + 1;
      totalPoints += q.maxPoints;
    });
    return { typeCount, totalPoints };
  }, [questions]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading question bank...</p>
        </div>
      </div>
    );
  }

  if (!bank) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <FileQuestion className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Question Bank Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The question bank you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => router.push("/teacher/question-banks")}
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Question Banks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <button
            onClick={() => router.push("/teacher/question-banks")}
            className="group flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Question Banks
          </button>

          {/* Bank Info */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  <Layers className="h-6 w-6" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  {bank.name}
                </h1>
              </div>
              {bank.description && (
                <p className="text-slate-600 dark:text-slate-400 mb-3">{bank.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <FileQuestion className="w-4 h-4" />
                  {questions.length} questions
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  {stats.totalPoints} total points
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Created {formatDistanceToNow(new Date(bank.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            <button
              onClick={handleCreateQuestion}
              className="inline-flex items-center justify-center h-11 px-5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Question
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700/50">
              {/* Select All */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedQuestions.size > 0 && selectedQuestions.size === filteredQuestions.length}
                  onChange={handleSelectAll}
                  className="sr-only peer"
                />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedQuestions.size > 0
                  ? "bg-indigo-600 border-indigo-600"
                  : "border-slate-300 dark:border-slate-600"
                  }`}>
                  {selectedQuestions.size > 0 && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Select all</span>
              </label>

              <div className="flex-1 h-px sm:h-auto sm:w-px bg-slate-200 dark:bg-slate-700" />

              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full h-9 pl-9 pr-3 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder-slate-400"
                />
              </div>

              {/* Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="h-9 px-3 pr-8 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="MULTI_SELECT">Multi Select</option>
                <option value="TRUE_FALSE">True/False</option>
                <option value="FILL_BLANK">Fill in Blank</option>
                <option value="ESSAY">Essay</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-9 px-3 pr-8 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                <option value="order">Default</option>
                <option value="type">By Type</option>
                <option value="points">By Points</option>
              </select>
            </div>

            {/* Questions List */}
            {filteredQuestions.length === 0 ? (
              <div className="bg-white dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No questions found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {searchTerm || filterType !== "ALL"
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first question"}
                </p>
                {!searchTerm && filterType === "ALL" && (
                  <button
                    onClick={handleCreateQuestion}
                    className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Question
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    isSelected={selectedQuestions.has(question.id)}
                    onSelect={(checked) => handleSelectQuestion(question.id, checked)}
                    onEdit={() => handleEditQuestion(question)}
                    onDelete={() => setDeleteQuestionId(question.id)}
                    isDeleting={deleteMutation.isPending}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <QuestionBankStats questions={questions} />
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedQuestions.size > 0 && (
        <BulkActionBar
          selectedCount={selectedQuestions.size}
          onDelete={handleBulkDelete}
          onClear={() => setSelectedQuestions(new Set())}
          isDeleting={bulkDeleteMutation.isPending}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteQuestionId !== null}
        questionId={deleteQuestionId}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteQuestionId(null)}
        isDeleting={deleteMutation.isPending}
      />

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
