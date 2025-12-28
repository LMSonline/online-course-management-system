import { DollarSign, Calendar, Target, TrendingUp, Info } from "lucide-react";
import { CourseFormData } from "@/hooks/teacher/useCreateCourse";

interface Step4VersionDetailsProps {
    formData: CourseFormData;
    updateFormData: (updates: Partial<CourseFormData>) => void;
    onSubmit: () => void;
    onBack: () => void;
    isLoading: boolean;
}

export const Step4VersionDetails = ({
    formData,
    updateFormData,
    onSubmit,
    onBack,
    isLoading,
}: Step4VersionDetailsProps) => {
    const isValid = formData.versionTitle.trim() && formData.price >= 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                    <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Course Version & Pricing
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Set up your course version with pricing and completion requirements
                    </p>
                </div>
            </div>

            {/* Version Title */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Version Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.versionTitle}
                    onChange={(e) => updateFormData({ versionTitle: e.target.value })}
                    placeholder="e.g., v1.0 - Initial Release"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
            </div>

            {/* Version Description */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Version Description
                </label>
                <textarea
                    value={formData.versionDescription}
                    onChange={(e) => updateFormData({ versionDescription: e.target.value })}
                    placeholder="Describe what's included in this version..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Giá khóa học (VND) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => updateFormData({ price: Number(e.target.value) })}
                            min="0"
                            step="1000"
                            placeholder="0"
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Đặt giá 0 cho khóa học miễn phí
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Course Duration (Days)
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="number"
                            value={formData.durationDays}
                            onChange={(e) => updateFormData({ durationDays: Number(e.target.value) })}
                            min="1"
                            placeholder="30"
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Completion Requirements */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                        Completion Requirements
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Điểm đạt (0-10)
                        </label>
                        <input
                            type="number"
                            value={formData.passScore}
                            onChange={(e) => updateFormData({ passScore: Number(e.target.value) })}
                            min="0"
                            max="10"
                            step="0.1"
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Ví dụ: 8.0 = điểm trung bình đạt
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Tiến độ tối thiểu (%)
                        </label>
                        <input
                            type="number"
                            value={formData.minProgressPct}
                            onChange={(e) => updateFormData({ minProgressPct: Number(e.target.value) })}
                            min="0"
                            max="100"
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Trọng số điểm cuối (0-1)
                        </label>
                        <input
                            type="number"
                            value={formData.finalWeight}
                            onChange={(e) => updateFormData({ finalWeight: Number(e.target.value) })}
                            min="0"
                            max="1"
                            step="0.1"
                            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Ví dụ: 0.6 = 60% trọng số
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2 pt-2">
                    <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        These settings determine how students complete and pass your course
                    </p>
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Internal Notes
                </label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => updateFormData({ notes: e.target.value })}
                    placeholder="Add any internal notes about this version (optional)"
                    rows={3}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                />
            </div>

            {/* Summary Card */}
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
                    Tóm tắt khóa học
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-1">Giá khóa học</p>
                        <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                            {formData.price.toLocaleString('vi-VN')} ₫
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-1">Thời lượng</p>
                        <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                            {formData.durationDays} ngày
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-1">Điểm đạt</p>
                        <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                            {formData.passScore}/10
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-1">Tiến độ tối thiểu</p>
                        <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                            {formData.minProgressPct}%
                        </p>
                    </div>
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
                    onClick={onSubmit}
                    disabled={!isValid || isLoading}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-300 dark:disabled:from-slate-700 dark:disabled:to-slate-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-600/30 disabled:shadow-none disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <TrendingUp className="w-5 h-5 animate-pulse" />
                            Creating Course...
                        </>
                    ) : (
                        <>
                            <TrendingUp className="w-5 h-5" />
                            Create Course & Start Building
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
