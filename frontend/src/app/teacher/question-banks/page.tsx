"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { assessmentService } from "@/services/assessment/assessment.service";
import { QuestionBankResponse } from "@/services/assessment/assessment.types";
import { useTeacherId } from "@/hooks/useProfile";
import {
    BookOpen,
    Plus,
    Search,
    Edit,
    Trash2,
    MoreVertical,
    Filter,
    Grid,
    List,
} from "lucide-react";
import { QuestionBankDialog } from "@/core/components/teacher/question-banks";

export default function QuestionBanksPage() {
    const router = useRouter();
    const teacherId = useTeacherId();
    const [questionBanks, setQuestionBanks] = useState<QuestionBankResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [editingBank, setEditingBank] = useState<QuestionBankResponse | null>(
        null
    );
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    useEffect(() => {
        if (teacherId) {
            loadQuestionBanks();
        }
    }, [teacherId]);

    const loadQuestionBanks = async () => {
        if (!teacherId) return;

        try {
            setLoading(true);
            const data = await assessmentService.getQuestionBanksByTeacher(
                teacherId
            );
            setQuestionBanks(data);
        } catch (error) {
            console.error("Failed to load question banks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBank = () => {
        setEditingBank(null);
        setShowDialog(true);
    };

    const handleEditBank = (bank: QuestionBankResponse) => {
        setEditingBank(bank);
        setShowDialog(true);
    };

    const handleDeleteBank = async (id: number) => {
        try {
            await assessmentService.deleteQuestionBank(id);
            setQuestionBanks(questionBanks.filter((bank) => bank.id !== id));
            setDeleteConfirm(null);
        } catch (error) {
            console.error("Failed to delete question bank:", error);
        }
    };

    const handleDialogSuccess = () => {
        setShowDialog(false);
        setEditingBank(null);
        loadQuestionBanks();
    };

    const filteredBanks = questionBanks.filter((bank) =>
        bank.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Question Banks
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage your collection of questions for quizzes and assessments
                            </p>
                        </div>
                        <button
                            onClick={handleCreateBank}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            New Question Bank
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search question banks..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded ${viewMode === "grid"
                                    ? "bg-white shadow-sm text-purple-600"
                                    : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                <Grid className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded ${viewMode === "list"
                                    ? "bg-white shadow-sm text-purple-600"
                                    : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                <List className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filteredBanks.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No question banks
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by creating a new question bank.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={handleCreateBank}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                New Question Bank
                            </button>
                        </div>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredBanks.map((bank) => (
                            <div
                                key={bank.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3
                                                className="text-lg font-semibold text-gray-900 hover:text-purple-600 cursor-pointer"
                                                onClick={() =>
                                                    router.push(`/teacher/question-banks/${bank.id}`)
                                                }
                                            >
                                                {bank.name}
                                            </h3>
                                            {bank.description && (
                                                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                                    {bank.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="relative ml-2">
                                            <button
                                                onClick={() =>
                                                    setDeleteConfirm(
                                                        deleteConfirm === bank.id ? null : bank.id
                                                    )
                                                }
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                            {deleteConfirm === bank.id && (
                                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="py-1">
                                                        <button
                                                            onClick={() => handleEditBank(bank)}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBank(bank.id)}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span className="flex items-center">
                                            <BookOpen className="h-4 w-4 mr-1" />
                                            Questions
                                        </span>
                                        <span className="text-xs">
                                            {new Date(bank.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() =>
                                                router.push(`/teacher/question-banks/${bank.id}`)
                                            }
                                            className="w-full text-center px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
                                        >
                                            Manage Questions
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                        <ul className="divide-y divide-gray-200">
                            {filteredBanks.map((bank) => (
                                <li key={bank.id} className="p-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3
                                                className="text-lg font-semibold text-gray-900 hover:text-purple-600 cursor-pointer"
                                                onClick={() =>
                                                    router.push(`/teacher/question-banks/${bank.id}`)
                                                }
                                            >
                                                {bank.name}
                                            </h3>
                                            {bank.description && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {bank.description}
                                                </p>
                                            )}
                                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <BookOpen className="h-4 w-4 mr-1" />
                                                    Questions
                                                </span>
                                                <span className="text-xs">
                                                    Created {new Date(bank.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            <button
                                                onClick={() =>
                                                    router.push(`/teacher/question-banks/${bank.id}`)
                                                }
                                                className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
                                            >
                                                Manage
                                            </button>
                                            <button
                                                onClick={() => handleEditBank(bank)}
                                                className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBank(bank.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 rounded-md"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Dialog */}
            {showDialog && (
                <QuestionBankDialog
                    bank={editingBank}
                    onClose={() => {
                        setShowDialog(false);
                        setEditingBank(null);
                    }}
                    onSuccess={handleDialogSuccess}
                />
            )}
        </div>
    );
}
