"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCourseDetail } from "@/hooks/course/useCourseDetail";
import { useUpdateCourseMutation } from "@/hooks/creator/useCourseMutations";
import { CourseUpdateRequest } from "@/services/courses/course.types";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

/**
 * Edit Course Page
 * Route: /teacher/courses/:slug/edit
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * Data:
 * - COURSE_GET_DETAIL (by slug)
 * - COURSE_UPDATE (mutation)
 */
export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [formData, setFormData] = useState<CourseUpdateRequest>({
    title: "",
    shortDescription: "",
  });

  // Fetch course by slug
  const { data: course, isLoading: isLoadingCourse } = useCourseDetail(slug);

  const { mutate: updateCourse, isPending } = useUpdateCourseMutation();

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        shortDescription: course.shortDescription || "",
        categoryId: course.categoryId,
        difficulty: course.difficulty,
        tags: course.tags,
        isClosed: course.isClosed,
        isIndexed: course.isIndexed,
        metaTitle: course.metaTitle,
        metaDescription: course.metaDescription,
        seoKeywords: course.seoKeywords,
      });
    }
  }, [course]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!course?.id) {
      toast.error("Course ID not available");
      return;
    }

    updateCourse(
      {
        courseId: course.id,
        payload: formData,
      },
      {
        onSuccess: () => {
          router.push("/teacher/courses");
        },
      }
    );
  };

  if (isLoadingCourse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-600)]" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Course not found
          </h2>
          <p className="text-red-600 dark:text-red-300 text-sm mb-4">
            The course you're trying to edit doesn't exist.
          </p>
          <Link
            href="/teacher/courses"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/teacher/courses"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      <h1 className="text-3xl font-bold mb-8">Edit Course</h1>

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
            disabled={isPending}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-900)] transition disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Changes
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

