"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import { CoursePlayerShell } from "@/core/components/learner/player/CoursePlayerShell";
import { CourseHero } from "@/core/components/learner/course/CourseHero";
import { CourseWhatYouWillLearn } from "@/core/components/learner/course/CourseWhatYouWillLearn";
import { CourseContentOutline } from "@/core/components/learner/course/CourseContentOutline";
import { CourseTeacherCard } from "@/core/components/learner/course/CourseTeacherCard";
import { CourseStudentFeedback } from "@/core/components/learner/course/CourseStudentFeedback";
import { CourseIncludes } from "@/core/components/learner/course/CourseIncludes";
import { courseService } from "@/services/courses/course.service";
import { courseVersionService } from "@/services/courses/courseVersion.service";
import { CourseVersionResponse } from "@/services/courses/course.types";
import { useAuthStore } from "@/lib/auth/authStore";
import { enrollmentService } from "@/services/enrollment/enrollment.service";
import type { CourseDetail } from "@/lib/learner/course/types";
import type { PlayerCourse, PlayerSection, PlayerLesson } from "@/lib/learner/player/types";
// Map CourseDetail -> PlayerCourse (for CoursePlayerShell)
function mapToPlayerCourse(course: CourseDetail): PlayerCourse {
  // Map sections to PlayerSection[] với lesson mẫu nếu thiếu
  const sections: PlayerSection[] = (course.sections || []).map((sec, idx) => ({
    id: sec.id,
    title: sec.title,
    lecturesCount: sec.lecturesCount,
    duration: sec.duration,
    lessons: Array.isArray(sec.lessons) && sec.lessons.length > 0
      ? sec.lessons
      : [
          {
            id: `l${idx + 1}-1`,
            title: "Sample lesson",
            duration: "05:00",
            videoUrl: "/video/sample.mp4",
            isPreview: true,
            completed: false,
          },
        ],
  }));
  // Nếu không có section nào, tạo 1 section mẫu
  const safeSections = sections.length > 0 ? sections : [
    {
      id: "sec1",
      title: "Sample section",
      lecturesCount: 1,
      duration: "05:00",
      lessons: [
        {
          id: "l1-1",
          title: "Sample lesson",
          duration: "05:00",
          videoUrl: "/video/sample.mp4",
          isPreview: true,
          completed: false,
        },
      ],
    },
  ];
  return {
    slug: course.slug,
    title: course.title,
    level: course.level,
    sections: safeSections,
    progress: 0,
    totalDuration: safeSections.map(s => s.duration).join(", "),
  };
}
// Map CourseDetailResponse (API) -> CourseDetail (UI)
async function mapCourseDetail(api: any, studentId?: number): Promise<CourseDetail> {
  // Lấy version list
  let versions: CourseVersionResponse[] = [];
  try {
    versions = await courseVersionService.getCourseVersions(api.id);
  } catch {}
  // Lấy version đầu tiên và mới nhất
  const sortedVersions = versions.slice().sort((a, b) => a.id - b.id);
  const firstVersion = sortedVersions[0];
  const latestVersion = sortedVersions[sortedVersions.length - 1];
  let price = 0;
  let originalPrice = 0;
  if (latestVersion) {
    const latestDetail = await courseVersionService.getCourseVersionById(api.id, latestVersion.id);
    price = latestDetail?.price ?? 0;
  }
  if (firstVersion) {
    const firstDetail = await courseVersionService.getCourseVersionById(api.id, firstVersion.id);
    originalPrice = firstDetail?.price ?? price;
  } else {
    originalPrice = price;
  }
  const discountPercent = price < originalPrice && originalPrice > 0 ? Math.round(100 - (price / originalPrice) * 100) : undefined;

  // Kiểm tra enroll
  let isEnrolled = false;
  if (studentId) {
    try {
      const enrollments = await enrollmentService.getStudentEnrollments(studentId, 0, 100);
      isEnrolled = enrollments.items.some(e => e.courseId === api.id && e.status === "ENROLLED");
    } catch {}
  }

  return {
    id: String(api.id),
    slug: api.slug || "",
    title: api.title || "",
    subtitle: api.shortDescription || "No subtitle provided",
    rating: typeof api.rating === "number" ? api.rating : 0.0,
    ratingCount: typeof api.ratingCount === "number" ? api.ratingCount : 0,
    studentsCount: typeof api.studentsCount === "number" ? api.studentsCount : 0,
    lastUpdated: api.updatedAt || api.lastUpdated || "N/A",
    language: api.language || "English",
    subtitles: Array.isArray(api.subtitles) ? api.subtitles : ["English"],
    level: api.difficulty === "BEGINNER" ? "Beginner" : api.difficulty === "INTERMEDIATE" ? "Intermediate" : api.difficulty === "ADVANCED" ? "Advanced" : "Beginner",
    whatYouWillLearn: Array.isArray(api.whatYouWillLearn) ? api.whatYouWillLearn : ["No data"],
    includes: Array.isArray(api.includes) ? api.includes : ["Full lifetime access"],
    sections: Array.isArray(api.sections) ? api.sections : [],
    description: api.description || api.metaDescription || "No description provided",
    instructor: api.instructor || {
      name: api.teacherName || "Unknown Instructor",
      title: "Instructor",
      avatarUrl: "",
      about: "No instructor info."
    },
    price,
    originalPrice,
    discountPercent,
    isEnrolled,
  };
}


import React from "react";
export default function StudentCourseLearnPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { studentId } = useAuthStore();
  const [mappedCourse, setMappedCourse] = React.useState<CourseDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const apiCourse = await courseService.getCourseBySlug(slug);
        const detail = await mapCourseDetail(apiCourse, studentId ?? undefined);
        if (mounted) setMappedCourse(detail);
      } catch {
        if (mounted) setMappedCourse(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (slug) fetchData();
    return () => { mounted = false; };
  }, [slug, studentId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Đang tải khoá học...</div>;
  }
  if (!mappedCourse) return notFound();

  return (
    <div className="bg-slate-950 text-slate-50">
      <CourseHero course={mappedCourse} />
      <main className="mx-auto flex w-full max-w-6xl xl:max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-10 xl:px-0 py-6 md:py-8 lg:flex-row">
        {/* Left column: Player + nội dung */}
        <div className="flex-1 space-y-5">
          <CoursePlayerShell course={mapToPlayerCourse(mappedCourse)} />
          <CourseWhatYouWillLearn course={mappedCourse} />
          <CourseContentOutline course={mappedCourse} />
          <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5">
            <h2 className="text-lg md:text-xl font-semibold mb-3">Description</h2>
            <p className="text-sm md:text-[15px] text-slate-200 leading-relaxed">
              {mappedCourse.description}
            </p>
          </section>
          <CourseStudentFeedback course={mappedCourse} />
        </div>
        {/* Right column: Thông tin khoá học */}
        <aside className="w-full lg:w-80 xl:w-96 space-y-5">
          <CourseIncludes course={mappedCourse} />
          <CourseTeacherCard course={mappedCourse} />
        </aside>
      </main>
    </div>
  );
}