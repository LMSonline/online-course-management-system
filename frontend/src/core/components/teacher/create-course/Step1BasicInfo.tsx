import { AlertCircle, BookOpen, Tag as TagIcon, TrendingUp } from "lucide-react";
import { CourseFormData } from "@/hooks/teacher/useCreateCourse";
import { CategoryResponse, TagResponse, Difficulty } from "@/services/courses/course.types";

interface Step1BasicInfoProps {
    formData: CourseFormData;
    updateFormData: (updates: Partial<CourseFormData>) => void;
    categories: CategoryResponse[];
    tags: TagResponse[];
    onNext: () => void;
    isLoading: boolean;
    loadingCategories?: boolean;
    loadingTags?: boolean;
}

export const Step1BasicInfo = ({
    formData,
    updateFormData,
    categories,
    tags,
    onNext,
    isLoading,
    loadingCategories = false,
    loadingTags = false,
}: Step1BasicInfoProps) => {
    const difficulties: { value: Difficulty; label: string; description: string }[] = [
        { value: "BEGINNER", label: "Beginner", description: "No prior knowledge required" },
        { value: "INTERMEDIATE", label: "Intermediate", description: "Some experience needed" },
        { value: "ADVANCED", label: "Advanced", description: "Expert level content" },
    ];

    const isValid =
        formData.title.trim() &&
        formData.shortDescription.trim() &&
        formData.categoryId > 0 &&
        formData.difficulty;

    const toggleTag = (tagName: string) => {
        if (formData.tags.includes(tagName)) {
            updateFormData({ tags: formData.tags.filter((t) => t !== tagName) });
        } else {
            updateFormData({ tags: [...formData.tags, tagName] });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="p-3 bg-indigo-500/10 rounded-lg">
                    <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Basic Information
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Let's start with the essential details of your course
                    </p>
                </div>
            </div>

            {/* Course Title */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Course Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    placeholder="e.g., Complete Web Development Bootcamp 2025"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    maxLength={100}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {formData.title.length}/100 characters
                </p>
            </div>

            {/* Short Description */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={formData.shortDescription}
                    onChange={(e) => updateFormData({ shortDescription: e.target.value })}
                    placeholder="Brief overview of what students will learn in this course..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    maxLength={500}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {formData.shortDescription.length}/500 characters
                </p>
            </div>

            {/* Category Selection */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Category <span className="text-red-500">*</span>
                </label>
                {loadingCategories ? (
                    <div className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg animate-pulse">
                        <div className="h-5 bg-slate-300 dark:bg-slate-600 rounded w-1/3"></div>
                    </div>
                ) : (
                    <select
                        value={formData.categoryId}
                        onChange={(e) => updateFormData({ categoryId: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    >
                        <option value={0}>Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                )}
                {!loadingCategories && categories.length === 0 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        No categories available. Please contact administrator.
                    </p>
                )}
            </div>

            {/* Difficulty Level */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Difficulty Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {difficulties.map((level) => (
                        <button
                            key={level.value}
                            type="button"
                            onClick={() => updateFormData({ difficulty: level.value })}
                            className={`p-4 border-2 rounded-lg transition-all text-left ${formData.difficulty === level.value
                                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                                    : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp
                                    className={`w-5 h-5 ${formData.difficulty === level.value
                                            ? "text-indigo-600 dark:text-indigo-400"
                                            : "text-slate-400"
                                        }`}
                                />
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {level.label}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                {level.description}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Tags (Optional)
                </label>
                {loadingTags ? (
                    <div className="flex flex-wrap gap-2">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"
                            ></div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="flex flex-wrap gap-2">
                            {tags.length > 0 ? (
                                tags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => toggleTag(tag.name)}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${formData.tags.includes(tag.name)
                                                ? "bg-indigo-600 text-white"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                            }`}
                                    >
                                        <TagIcon className="w-3.5 h-3.5" />
                                        {tag.name}
                                    </button>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    No tags available yet
                                </p>
                            )}
                        </div>
                        {formData.tags.length > 0 && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                Selected: {formData.tags.join(", ")}
                            </p>
                        )}
                    </>
                )}
            </div>

            {/* Info Alert */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-medium mb-1">Pro Tip</p>
                    <p className="text-blue-700 dark:text-blue-300">
                        A clear, descriptive title and well-written description help students find and
                        understand your course better.
                    </p>
                </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={onNext}
                    disabled={!isValid || isLoading}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-600/30 disabled:shadow-none disabled:cursor-not-allowed"
                >
                    {isLoading ? "Creating..." : "Continue to SEO Settings"}
                </button>
            </div>
        </div>
    );
};
