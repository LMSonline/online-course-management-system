"use client";

import { useTeacherPublicProfile } from "@/hooks/public/useTeacherPublicProfile";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courses/course.service";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Users, Star, AlertCircle, ArrowRight } from "lucide-react";

/**
 * TeacherPublicProfileScreen
 * Route: /teachers/:id
 * Layout: PublicLayout
 * Guard: none
 * 
 * NOTE: :id = teacherId (NOT accountId)
 * 
 * Shows teacher public profile with:
 * - Teacher info (name, headline, bio, avatar)
 * - Stats (total courses, total students if available)
 * - Course list by teacher
 */
export default function TeacherPublicProfileScreen({
  params,
}: {
  params: { id: string };
}) {
  const searchParams = useSearchParams();
  const teacherId = parseInt(params.id, 10);
  const page = parseInt(searchParams.get("page") || "0");
  const size = parseInt(searchParams.get("size") || "20");

  const {
    data: teacher,
    isLoading: isLoadingTeacher,
    isError: isTeacherError,
    error: teacherError,
    refetch: refetchTeacher,
  } = useTeacherPublicProfile(teacherId);

  // Fetch courses by teacher
  // Note: Backend API may need teacherId filter - check if /courses?teacherId=:id is supported
  // For now, we'll show all courses (backend should filter by teacherId if supported)
  const {
    data: coursesData,
    isLoading: isLoadingCourses,
  } = useQuery({
    queryKey: [CONTRACT_KEYS.COURSE_GET_LIST, { teacherId, page, size }],
    queryFn: () =>
      courseService.getCoursesActive({
        page,
        size,
        // TODO: Add teacherId filter when backend supports it
        // filter: `teacherId:${teacherId}`,
      }),
    enabled: !!teacherId && !isNaN(teacherId),
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Filter courses client-side by teacherId if backend doesn't support it
  const allCourses = coursesData?.content || [];
  const courses = allCourses.filter((c) => c.teacherId === teacherId);

  if (isLoadingTeacher) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded mb-8" />
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  if (isTeacherError || !teacher) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Teacher not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {teacherError?.message || "The teacher profile you're looking for doesn't exist."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => refetchTeacher()}
              className="px-6 py-3 bg-[var(--brand-600)] text-white rounded-xl hover:bg-[var(--brand-900)] transition"
            >
              Retry
            </button>
            <Link
              href="/courses"
              className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Teacher Header */}
      <div className="bg-slate-900/40 border border-white/10 rounded-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {teacher.avatarUrl ? (
              <Image
                src={teacher.avatarUrl}
                alt={teacher.fullName || "Teacher"}
                width={120}
                height={120}
                className="rounded-full"
              />
            ) : (
              <div className="w-30 h-30 rounded-full bg-slate-700 flex items-center justify-center">
                <span className="text-4xl font-semibold">
                  {(teacher.fullName || "T")[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {teacher.fullName || `Teacher #${teacher.id}`}
            </h1>
            {teacher.headline && (
              <p className="text-xl text-[var(--brand-600)] mb-4">{teacher.headline}</p>
            )}
            {teacher.bio && (
              <p className="text-gray-300 mb-4">{teacher.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Courses by {teacher.fullName || "this teacher"}</h2>

        {isLoadingCourses ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No courses available yet</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="bg-slate-900/40 border border-white/10 rounded-xl overflow-hidden hover:border-[var(--brand-600)]/50 transition group"
                >
                  {course.thumbnailUrl ? (
                    <div className="relative aspect-video">
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-slate-800 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-slate-400" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-[var(--brand-600)] transition">
                      {course.title}
                    </h3>
                    {course.shortDescription && (
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {course.shortDescription}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <ArrowRight className="h-4 w-4 group-hover:text-[var(--brand-600)] transition" />
                      <span>View course</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {coursesData && coursesData.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {page > 0 && (
                  <Link
                    href={`/teachers/${params.id}?page=${page - 1}&size=${size}`}
                    className="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: coursesData.totalPages }, (_, i) => (
                  <Link
                    key={i}
                    href={`/teachers/${params.id}?page=${i}&size=${size}`}
                    className={`px-4 py-2 rounded-lg ${
                      i === page
                        ? "bg-[var(--brand-600)] text-white"
                        : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                    }`}
                  >
                    {i + 1}
                  </Link>
                ))}
                {page < coursesData.totalPages - 1 && (
                  <Link
                    href={`/teachers/${params.id}?page=${page + 1}&size=${size}`}
                    className="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
