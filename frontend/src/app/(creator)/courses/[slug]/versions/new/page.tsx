"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useCourseDetail } from "@/hooks/course/useCourseDetail";
import { useCreateVersionMutation } from "@/hooks/creator/useVersionMutations";
import { CourseVersionRequest } from "@/services/courses/course.types";
import { Loader2, ArrowLeft, Plus } from "lucide-react";

/**
 * Create Version Page
 * Route: /courses/:slug/versions/new
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * Data:
 * - COURSE_GET_DETAIL (by slug to get courseId)
 * - VERSION_CREATE (mutation)
 */
export default function CreateVersionScreen() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: course, isLoading: isLoadingCourse } = useCourseDetail(slug);
  const courseId = course?.id;

  const { mutate: createVersion, isPending } = useCreateVersionMutation();

  const [formData, setFormData] = useState<CourseVersionRequest>({
    title: "",
    description: "",
    price: 0,
    durationDays: 30,
    passScore: 70,
    finalWeight: 100,
    minProgressPct: 80,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) {
      alert("Course ID not available");
      return;
    }

    createVersion(
      {
        courseId,
        payload: formData,
      },
      {
        onSuccess: (data) => {
          router.push(`/courses/${slug}/versions/${data.id}`);
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

  if (!course || !courseId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Course not found
          </h2>
          <p className="text-red-600 dark:text-red-300 text-sm mb-4">
            The course you're trying to create a version for doesn't exist.
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
        href={`/courses/${slug}/versions`}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Versions
      </Link>

      <h1 className="text-3xl font-bold mb-2">Create New Version</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">{course.title}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Version Title <span className="text-red-500">*</span>
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

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[var(--brand-600)] focus:border-transparent resize-none"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Price
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[var(--brand-600)] focus:border-transparent"
          />
        </div>

        {/* Duration Days */}
        <div>
          <label htmlFor="durationDays" className="block text-sm font-medium mb-2">
            Duration (days)
          </label>
          <input
            id="durationDays"
            type="number"
            min="1"
            value={formData.durationDays}
            onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value, 10) || 30 })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[var(--brand-600)] focus:border-transparent"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[var(--brand-600)] focus:border-transparent resize-none"
          />
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
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Create Version
              </>
            )}
          </button>
          <Link
            href={`/courses/${slug}/versions`}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}


