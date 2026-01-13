"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Plus,
    FileText,
    Clock,
    CheckCircle2,
    Users,
    Loader2,
    RefreshCw,
    Sparkles,
    Filter
} from "lucide-react";
import Button from "@/core/components/ui/Button";
import Input from "@/core/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/Select";
import {
    useAllIndependentAssignments,
    useCreateIndependentAssignment,
    useDeleteAssignment,
} from "@/hooks/teacher/useTeacherAssignment";
import { AssignmentCard, CreateAssignmentDialog, DeleteAssignmentDialog } from "@/core/components/teacher/assignment";
import type { AssignmentResponse, AssignmentRequest } from "@/services/assignment/assignment.types";

export default function TeacherAssignmentsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState<AssignmentResponse | null>(null);

    const { data: assignments = [], isLoading, refetch, isRefetching } = useAllIndependentAssignments();
    const createMutation = useCreateIndependentAssignment();
    const deleteMutation = useDeleteAssignment();

    const handleCreateAssignment = (payload: AssignmentRequest) => {
        createMutation.mutate(payload, {
            onSuccess: (data) => {
                setShowCreateDialog(false);
                router.push(`/teacher/assignments/${data.id}`);
            },
        });
    };

    const handleDeleteAssignment = () => {
        if (assignmentToDelete) {
            deleteMutation.mutate(assignmentToDelete.id, {
                onSuccess: () => {
                    setAssignmentToDelete(null);
                },
            });
        }
    };

    const filteredAssignments = useMemo(() => {
        return assignments.filter((assignment) => {
            const matchesSearch =
                searchQuery === "" ||
                assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                assignment.description?.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesSearch;
        });
    }, [assignments, searchQuery]);

    const stats = useMemo(() => {
        const total = assignments.length;
        return { total };
    }, [assignments]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse" />
                            <Loader2 className="h-12 w-12 animate-spin text-indigo-500 relative" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading assignments...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-800/50 rounded-3xl shadow-sm shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-700/50 p-8 backdrop-blur-sm">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl blur-lg opacity-40" />
                                <div className="relative p-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg">
                                    <FileText className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                    Assignment Library
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">
                                    Create and manage assignments for your courses
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => refetch()}
                                disabled={isRefetching}
                                className="hidden md:flex bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
                                Refresh
                            </Button>
                            <Button
                                onClick={() => setShowCreateDialog(true)}
                                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 border-0 shadow-lg shadow-indigo-500/25"
                            >
                                <Sparkles className="mr-2 h-4 w-4" />
                                Create Assignment
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="relative mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
                                    <FileText className="h-4 w-4" />
                                    Total Assignments
                                </div>
                                <span className="text-2xl font-bold text-slate-800 dark:text-white">{stats.total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/50 p-4 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search assignments..."
                                className="pl-12 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-base"
                            />
                        </div>
                    </div>
                </div>

                {/* Assignments Grid */}
                {filteredAssignments.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800/50 rounded-3xl shadow-sm border border-dashed border-slate-300 dark:border-slate-600 backdrop-blur-sm">
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-2xl" />
                                <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                                    <FileText className="h-12 w-12 text-indigo-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mt-6 mb-2">
                                {searchQuery ? "No assignments found" : "No assignments yet"}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-8">
                                {searchQuery
                                    ? "Try adjusting your search."
                                    : "Create your first assignment to get started."}
                            </p>
                            {!searchQuery && (
                                <Button
                                    onClick={() => setShowCreateDialog(true)}
                                    className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 border-0 shadow-lg shadow-indigo-500/25 px-6 py-3 text-base"
                                >
                                    <Plus className="mr-2 h-5 w-5" />
                                    Create Your First Assignment
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{filteredAssignments.length}</span> of {stats.total} assignments
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredAssignments.map((assignment) => (
                                <AssignmentCard
                                    key={assignment.id}
                                    assignment={assignment}
                                    onEdit={(a) => router.push(`/teacher/assignments/${a.id}`)}
                                    onDelete={(a) => setAssignmentToDelete(a)}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Dialogs */}
                <CreateAssignmentDialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                    onSubmit={handleCreateAssignment}
                    isLoading={createMutation.isPending}
                />

                <DeleteAssignmentDialog
                    assignment={assignmentToDelete}
                    open={!!assignmentToDelete}
                    onOpenChange={(open) => !open && setAssignmentToDelete(null)}
                    onConfirm={handleDeleteAssignment}
                    isLoading={deleteMutation.isPending}
                />
            </div>
        </div>
    );
}
