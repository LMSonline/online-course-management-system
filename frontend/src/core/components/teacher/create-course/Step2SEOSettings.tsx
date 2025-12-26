import { Search, Globe, Eye, EyeOff } from "lucide-react";
import { CourseFormData } from "@/hooks/teacher/useCreateCourse";

interface Step2SEOSettingsProps {
    formData: CourseFormData;
    updateFormData: (updates: Partial<CourseFormData>) => void;
    onNext: () => void;
    onBack: () => void;
    isLoading: boolean;
}

export const Step2SEOSettings = ({
    formData,
    updateFormData,
    onNext,
    onBack,
    isLoading,
}: Step2SEOSettingsProps) => {
    const autoGenerateMetaTitle = () => {
        updateFormData({ metaTitle: formData.title });
    };

    const autoGenerateMetaDescription = () => {
        updateFormData({ metaDescription: formData.shortDescription });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="p-3 bg-green-500/10 rounded-lg">
                    <Search className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        SEO & Metadata
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Optimize your course for search engines
                    </p>
                </div>
            </div>

            {/* Meta Title */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Meta Title
                    </label>
                    <button
                        type="button"
                        onClick={autoGenerateMetaTitle}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                    >
                        Auto-generate from title
                    </button>
                </div>
                <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => updateFormData({ metaTitle: e.target.value })}
                    placeholder="SEO-friendly title for search engines"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    maxLength={60}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {formData.metaTitle.length}/60 characters (Optimal: 50-60)
                </p>
            </div>

            {/* Meta Description */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Meta Description
                    </label>
                    <button
                        type="button"
                        onClick={autoGenerateMetaDescription}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                    >
                        Auto-generate from description
                    </button>
                </div>
                <textarea
                    value={formData.metaDescription}
                    onChange={(e) => updateFormData({ metaDescription: e.target.value })}
                    placeholder="Brief description that will appear in search results"
                    rows={3}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                    maxLength={160}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {formData.metaDescription.length}/160 characters (Optimal: 150-160)
                </p>
            </div>

            {/* SEO Keywords */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    SEO Keywords
                </label>
                <input
                    type="text"
                    value={formData.seoKeywords}
                    onChange={(e) => updateFormData({ seoKeywords: e.target.value })}
                    placeholder="e.g., web development, react, javascript, programming"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Separate keywords with commas
                </p>
            </div>

            {/* Indexing Settings */}
            <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Visibility Settings
                </label>

                {/* Search Engine Indexing */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                                Search Engine Indexing
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Allow search engines to index this course
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => updateFormData({ isIndexed: !formData.isIndexed })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isIndexed
                                ? "bg-green-600"
                                : "bg-slate-300 dark:bg-slate-600"
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isIndexed ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>

                {/* Course Status */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start gap-3">
                        {formData.isClosed ? (
                            <EyeOff className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                        ) : (
                            <Eye className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                        )}
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                                Course Status
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {formData.isClosed ? "Course is closed for enrollment" : "Course is open for enrollment"}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => updateFormData({ isClosed: !formData.isClosed })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${!formData.isClosed
                                ? "bg-green-600"
                                : "bg-slate-300 dark:bg-slate-600"
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${!formData.isClosed ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* SEO Preview */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-2 uppercase tracking-wide">
                    Search Engine Preview
                </p>
                <div className="space-y-1">
                    <p className="text-lg font-medium text-blue-600 dark:text-blue-400 line-clamp-1">
                        {formData.metaTitle || formData.title || "Your Course Title"}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-400">
                        https://yoursite.com/courses/course-slug
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                        {formData.metaDescription || formData.shortDescription || "Your course description will appear here..."}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
                <button
                    onClick={onBack}
                    className="px-6 py-3 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={isLoading}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-green-600/30 disabled:shadow-none disabled:cursor-not-allowed"
                >
                    {isLoading ? "Saving..." : "Continue to Thumbnail"}
                </button>
            </div>
        </div>
    );
};
