"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateCourseMutation } from "@/hooks/creator/useCourseMutations";
import { useAuthStore } from "@/lib/auth/authStore";
import { CourseRequest } from "@/services/courses/course.types";
import { Loader2, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

/**
 * Create Course Page
 * Route: /teacher/courses/new
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * Data:
 * - COURSE_CREATE (mutation)
 */
export default function CreateCoursePage() {
  const router = useRouter();
  const { teacherId } = useAuthStore();
  const { mutate: createCourse, isPending } = useCreateCourseMutation();

  const [formData, setFormData] = useState<Partial<CourseRequest>>({
    title: "",
    shortDescription: "",
    categoryId: 0,
    tags: [],
    isClosed: false,
    isIndexed: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teacherId) {
      alert("Teacher ID not available. Please ensure you're logged in as a teacher.");
      return;
    }

    if (!formData.title || !formData.shortDescription || !formData.categoryId) {
      alert("Please fill in all required fields");
      return;
    }

    const payload: CourseRequest = {
      title: formData.title,
      shortDescription: formData.shortDescription,
      categoryId: formData.categoryId,
      teacherId,
      tags: formData.tags || [],
      isClosed: formData.isClosed || false,
      isIndexed: formData.isIndexed !== false,
      difficulty: formData.difficulty,
    };

    createCourse(payload, {
      onSuccess: (data) => {
        // Redirect to edit page or versions page
        router.push(`/courses/${data.slug || data.id}/versions`);
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/teacher/courses"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[var(--brand-600)] focus:border-transparent"
          />
        </div>

        {/* Short Description */}
        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium mb-2">
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="shortDescription"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[var(--brand-600)] focus:border-transparent resize-none"
          />
        </div>

        {/* Category ID (simplified - would need category selector in real app) */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium mb-2">
            Category ID <span className="text-red-500">*</span>
          </label>
          <input
            id="categoryId"
            type="number"
            value={formData.categoryId || ""}
            onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value, 10) })}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[var(--brand-600)] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Note: Category selector not implemented. Enter category ID manually.
          </p>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            type="text"
            value={formData.tags?.join(", ") || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
              })
            }
            placeholder="tag1, tag2, tag3"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[var(--brand-600)] focus:border-transparent"
          />
        </div>

        {/* Is Closed */}
        <div className="flex items-center gap-2">
          <input
            id="isClosed"
            type="checkbox"
            checked={formData.isClosed || false}
            onChange={(e) => setFormData({ ...formData, isClosed: e.target.checked })}
            className="w-4 h-4 text-[var(--brand-600)] border-gray-300 rounded focus:ring-[var(--brand-600)]"
          />
          <label htmlFor="isClosed" className="text-sm font-medium">
            Course is closed (not accepting enrollments)
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isPending || !teacherId}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Create Course
              </>
            )}
          </button>
          <Link
            href="/teacher/courses"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}


