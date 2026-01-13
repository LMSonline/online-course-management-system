"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Upload,
    X,
    Plus,
    FileText,
    Calendar,
    DollarSign,
    Clock,
    Shield,
    Paperclip,
} from "lucide-react";
import { toast } from "sonner";
import { useCreateIndependentAssignment } from "@/hooks/teacher/useTeacherAssignment";
import { AssignmentType } from "@/services/assignment/assignment.types";

export default function CreateAssignmentPage() {
    const router = useRouter();
    const createMutation = useCreateIndependentAssignment();

    const [title, setTitle] = useState("");
    const [assignmentType, setAssignmentType] = useState<AssignmentType>("HOMEWORK");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [totalPoints, setTotalPoints] = useState("100");
    const [timeLimitMinutes, setTimeLimitMinutes] = useState("");
    const [maxAttempts, setMaxAttempts] = useState("");
    const [rubricItems, setRubricItems] = useState<{ criteria: string; points: string }[]>([]);
    const [attachments, setAttachments] = useState<File[]>([]);

    const handleAddRubricItem = () => {
        setRubricItems([...rubricItems, { criteria: "", points: "" }]);
    };

    const handleRemoveRubricItem = (index: number) => {
        setRubricItems(rubricItems.filter((_, i) => i !== index));
    };

    const handleUpdateRubricItem = (
        index: number,
        field: "criteria" | "points",
        value: string
    ) => {
        const updated = [...rubricItems];
        updated[index][field] = value;
        setRubricItems(updated);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setAttachments([...attachments, ...files]);
        e.target.value = "";
    };

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !assignmentType) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            await createMutation.mutateAsync({
                title,
                assignmentType,
                description: description || null,
                totalPoints: totalPoints ? Number(totalPoints) : null,
                timeLimitMinutes: timeLimitMinutes ? Number(timeLimitMinutes) : null,
                maxAttempts: maxAttempts ? Number(maxAttempts) : null,
                dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            });

            toast.success("Assignment created successfully!");
            router.push("/teacher/assignments");
        } catch (error) {
            toast.error("Failed to create assignment");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/teacher/assignments"
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                            Create New Assignment
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Create a new assignment for your students
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            {/* Assignment Type */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Assignment Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={assignmentType}
                                    onChange={(e) => setAssignmentType(e.target.value as AssignmentType)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    required
                                >
                                    <option value="PRACTICE">Practice</option>
                                    <option value="HOMEWORK">Homework</option>
                                    <option value="PROJECT">Project</option>
                                    <option value="FINAL_REPORT">Final Report</option>
                                </select>
                            </div>

                            {/* Assignment Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Assignment Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Build a Responsive Portfolio Website"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Provide detailed instructions, requirements, and guidelines for this assignment..."
                                    rows={6}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                    Include all requirements, deliverables, and evaluation criteria
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Settings */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            Assignment Settings
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Due Date */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Due Date (Optional)
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="datetime-local"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Leave empty for no deadline
                                </p>
                            </div>

                            {/* Total Points */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Total Points (Optional)
                                </label>
                                <input
                                    type="number"
                                    value={totalPoints}
                                    onChange={(e) => setTotalPoints(e.target.value)}
                                    placeholder="100"
                                    min="0"
                                    step="0.1"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Leave empty for ungraded assignment
                                </p>
                            </div>

                            {/* Time Limit */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Time Limit (Minutes)
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="number"
                                        value={timeLimitMinutes}
                                        onChange={(e) => setTimeLimitMinutes(e.target.value)}
                                        placeholder="No time limit"
                                        min="1"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Max Attempts */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Maximum Attempts
                                </label>
                                <input
                                    type="number"
                                    value={maxAttempts}
                                    onChange={(e) => setMaxAttempts(e.target.value)}
                                    placeholder="Unlimited"
                                    min="1"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Leave empty for unlimited attempts
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Grading Rubric */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                Grading Rubric (Optional)
                            </h2>
                            <button
                                type="button"
                                onClick={handleAddRubricItem}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Criteria
                            </button>
                        </div>

                        {rubricItems.length > 0 ? (
                            <div className="space-y-3">
                                {rubricItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                    >
                                        <input
                                            type="text"
                                            value={item.criteria}
                                            onChange={(e) =>
                                                handleUpdateRubricItem(index, "criteria", e.target.value)
                                            }
                                            placeholder="e.g., Code quality and organization"
                                            className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <input
                                            type="number"
                                            value={item.points}
                                            onChange={(e) =>
                                                handleUpdateRubricItem(index, "points", e.target.value)
                                            }
                                            placeholder="Points"
                                            className="w-24 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveRubricItem(index)}
                                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                                    No grading criteria added
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                    Define detailed instructions for completing this assignment
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Resources & Attachments */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Paperclip className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                Resources & Attachments (Optional)
                            </h2>
                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors">
                                <Upload className="w-4 h-4" />
                                Choose Files
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {attachments.length > 0 ? (
                            <div className="space-y-2">
                                {attachments.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(index)}
                                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                                    No files attached
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                    Drag and drop files here, or click to browse
                                </p>
                            </div>
                        )}

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                            Add files or resources to help students complete the assignment
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4">
                        <Link
                            href="/teacher/assignments"
                            className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-center transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {createMutation.isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Creating...
                                </span>
                            ) : (
                                "Create Assignment"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
