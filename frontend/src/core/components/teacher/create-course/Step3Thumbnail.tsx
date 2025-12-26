import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X, Check, AlertCircle } from "lucide-react";
import { CourseFormData } from "@/hooks/teacher/useCreateCourse";

interface Step3ThumbnailProps {
    formData: CourseFormData;
    onThumbnailSelect: (file: File) => void;
    onNext: () => void;
    onBack: () => void;
    onSkip: () => void;
    isLoading: boolean;
}

export const Step3Thumbnail = ({
    formData,
    onThumbnailSelect,
    onNext,
    onBack,
    onSkip,
    isLoading,
}: Step3ThumbnailProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB");
            return;
        }

        onThumbnailSelect(file);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const removeThumbnail = () => {
        onThumbnailSelect(null as any);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Course Thumbnail
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Upload an eye-catching image for your course
                    </p>
                </div>
            </div>

            {/* Upload Area */}
            <div className="space-y-4">
                {!formData.thumbnailPreview ? (
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl p-12 transition-all ${dragActive
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                : "border-slate-300 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-600"
                            }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />

                        <div className="text-center space-y-4">
                            <div className="inline-flex p-6 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                <Upload className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                            </div>

                            <div>
                                <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                    Drag and drop your image here
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    or click the button below to browse
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleButtonClick}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-600/30"
                            >
                                <Upload className="w-5 h-5" />
                                Choose File
                            </button>

                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Recommended: 1280x720px (16:9 aspect ratio) • Max 5MB • JPG, PNG, or WebP
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                        <img
                            src={formData.thumbnailPreview}
                            alt="Course thumbnail preview"
                            className="w-full h-auto aspect-video object-cover"
                        />

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={handleButtonClick}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                            >
                                <Upload className="w-4 h-4" />
                                Change Image
                            </button>
                            <button
                                type="button"
                                onClick={removeThumbnail}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Remove
                            </button>
                        </div>

                        {/* Success Badge */}
                        <div className="absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-full text-sm font-medium">
                            <Check className="w-4 h-4" />
                            Image Uploaded
                        </div>
                    </div>
                )}
            </div>

            {/* Tips */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900 dark:text-amber-100">
                    <p className="font-medium mb-1">Thumbnail Best Practices</p>
                    <ul className="text-amber-700 dark:text-amber-300 list-disc list-inside space-y-1">
                        <li>Use high-quality, relevant images that represent your course</li>
                        <li>Include text overlay with key benefits or topics</li>
                        <li>Keep it simple and avoid cluttered designs</li>
                        <li>Test on different screen sizes</li>
                    </ul>
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
                <div className="flex gap-3">
                    <button
                        onClick={onSkip}
                        className="px-6 py-3 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                    >
                        Skip for Now
                    </button>
                    <button
                        onClick={onNext}
                        disabled={!formData.thumbnailFile || isLoading}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-600/30 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Uploading..." : "Upload & Continue"}
                    </button>
                </div>
            </div>
        </div>
    );
};
