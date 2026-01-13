"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/services/courses/course.service";
import { categoryService } from "@/services/courses/category.service";
import { tagService } from "@/services/courses/tag.service";
import { CourseUpdateRequest, CourseDetailResponse } from "@/services/courses/course.types";
import { toast } from "sonner";
import {
    ArrowLeft,
    Save,
    Loader2,
    X,
    Tag as TagIcon,
    BookOpen,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditCoursePage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const slug = params.slug as string;

    const [formData, setFormData] = useState<CourseUpdateRequest>({
        title: "",
        shortDescription: "",
        categoryId: 0,
        difficulty: "BEGINNER",
        tags: [],
        metaTitle: "",
        metaDescription: "",
        seoKeywords: "",
    });
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const { data: course, isLoading: loadingCourse } = useQuery<CourseDetailResponse>({
        queryKey: ["course", slug],
        queryFn: () => courseService.getCourseBySlug(slug),
        enabled: !!slug,
    });

    // Set form data when course loads
    useEffect(() => {
        if (course) {
            setFormData({
                title: course.title,
                shortDescription: course.shortDescription || "",
                categoryId: course.category?.id || 0,
                difficulty: course.difficulty || "BEGINNER",
                tags: course.tags || [],
                metaTitle: course.metaTitle || "",
                metaDescription: course.metaDescription || "",
                seoKeywords: course.seoKeywords || "",
            });
            setSelectedTags(course.tags || []);
            if (course.thumbnailUrl) {
                setThumbnailPreview(course.thumbnailUrl);
            }
        }
    }, [course]);

    const { data: categoriesData = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: () => categoryService.getCategoryTree(),
    });

    const { data: tagsData } = useQuery({
        queryKey: ["tags"],
        queryFn: () => tagService.getTags(0, 100),
    });

    const tags = tagsData?.items || [];

    const updateMutation = useMutation({
        mutationFn: (data: CourseUpdateRequest) =>
            courseService.updateCourse(course!.id, data),
        onSuccess: () => {
            toast.success("Course updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["course", slug] });
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            router.push(`/teacher/courses`);
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update course");
        },
    });

    const uploadThumbnailMutation = useMutation({
        mutationFn: (file: File) =>
            courseService.uploadThumbnail(course!.id, file),
        onSuccess: () => {
            toast.success("Thumbnail updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["course", slug] });
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to upload thumbnail");
        },
    });

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnailFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeThumbnail = () => {
        setThumbnailFile(null);
        setThumbnailPreview(course?.thumbnailUrl || null);
    };

    const toggleTag = (tagName: string) => {
        setSelectedTags(prev =>
            prev.includes(tagName)
                ? prev.filter(t => t !== tagName)
                : [...prev, tagName]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title?.trim()) {
            toast.error("Please enter a course title");
            return;
        }

        if (!formData.categoryId || formData.categoryId === 0) {
            toast.error("Please select a category");
            return;
        }

        const updateData: CourseUpdateRequest = {
            ...formData,
            tags: selectedTags,
        };

        await updateMutation.mutateAsync(updateData);

        if (thumbnailFile) {
            await uploadThumbnailMutation.mutateAsync(thumbnailFile);
        }
    };

    if (loadingCourse) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Course not found
                    </h1>
                    <Link
                        href="/teacher/courses"
                        className="text-indigo-600 hover:text-indigo-700"
                    >
                        Back to courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/teacher/courses"
                        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to courses
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Edit Course</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Update course information and settings
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Course Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Enter course title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.shortDescription || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, shortDescription: e.target.value })
                                    }
                                    rows={4}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Describe your course..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={formData.categoryId || 0}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                categoryId: parseInt(e.target.value),
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    >
                                        <option value={0}>Select a category</option>
                                        {categoriesData.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Difficulty Level *
                                    </label>
                                    <select
                                        value={formData.difficulty || "BEGINNER"}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                difficulty: e.target.value as any,
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="BEGINNER">Beginner</option>
                                        <option value="INTERMEDIATE">Intermediate</option>
                                        <option value="ADVANCED">Advanced</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <TagIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            Tags
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleTag(tag.name)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTags.includes(tag.name)
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                        }`}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            SEO Settings
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.metaTitle || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, metaTitle: e.target.value })
                                    }
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Enter meta title for SEO"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Meta Description
                                </label>
                                <textarea
                                    value={formData.metaDescription || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            metaDescription: e.target.value,
                                        })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Enter meta description for SEO"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    SEO Keywords
                                </label>
                                <input
                                    type="text"
                                    value={formData.seoKeywords || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, seoKeywords: e.target.value })
                                    }
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Enter keywords separated by commas"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                            Course Thumbnail
                        </h2>

                        <div className="space-y-4">
                            {thumbnailPreview && (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <Image
                                        src={thumbnailPreview}
                                        alt="Thumbnail preview"
                                        fill
                                        className="object-cover"
                                    />
                                    {thumbnailFile && (
                                        <button
                                            type="button"
                                            onClick={removeThumbnail}
                                            className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="block w-full cursor-pointer">
                                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                            Click to upload new thumbnail
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500">
                                            PNG, JPG up to 10MB
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={updateMutation.isPending || uploadThumbnailMutation.isPending}
                            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                        >
                            {updateMutation.isPending || uploadThumbnailMutation.isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                        <Link
                            href="/teacher/courses"
                            className="px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
