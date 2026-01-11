"use client";
// src/app/(learner)/courses/[slug]/page.tsx
import { notFound } from "next/navigation";
import CourseHero from "@/core/components/learner/course/CourseHero";
import { CourseWhatYouWillLearn } from "@/core/components/learner/course/CourseWhatYouWillLearn";
import { CourseIncludes } from "@/core/components/learner/course/CourseIncludes";
import { CourseContentOutline } from "@/core/components/learner/course/CourseContentOutline";
import { CourseTeacherCard } from "@/core/components/learner/course/CourseTeacherCard";
import { CourseStudentFeedback } from "@/core/components/learner/course/CourseStudentFeedback";
import { useCourseDetail } from "@/hooks/learner/useCourseDetail";
import { use } from "react";

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params); // <-- dùng React.use để unwrap Promise
  const { courseDetail, comments, ratingSummary, loading, loadingComments, loadingRating } = useCourseDetail(slug);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!courseDetail) return notFound();

  return (
    <div className="bg-slate-950 text-slate-50">
      <CourseHero course={{ ...courseDetail, thumbnailUrl: courseDetail.thumbnailUrl }} />
      <main className="mx-auto flex w-full max-w-6xl xl:max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-10 xl:px-0 py-6 md:py-8 lg:flex-row">
        {/* Left column */}
        <div className="flex-1 space-y-5">
          <CourseWhatYouWillLearn/>
          <CourseContentOutline courseId={courseDetail.courseId} />
          <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5">
            <h2 className="text-lg md:text-xl font-semibold mb-3">Description</h2>
            <p className="text-sm md:text-[15px] text-slate-200 leading-relaxed">
              {courseDetail.description}
            </p>
          </section>
          <CourseStudentFeedback course={{ ...courseDetail, ...ratingSummary }} />
          {/* Bình luận */}
          <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5">
            <h2 className="text-lg font-semibold mb-3">Comments</h2>
            {loadingComments ? (
              <div>Loading comments...</div>
            ) : comments && comments.length > 0 ? (
              <ul className="space-y-3">
                {comments.map((c) => (
                  <li key={c.id} className="border-b border-white/10 pb-2">
                    <div className="font-semibold text-slate-100">{c.authorName}</div>
                    <div className="text-xs text-slate-400 mb-1">{c.createdAt}</div>
                    <div className="text-sm text-slate-200">{c.content}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-slate-400">No comments yet.</div>
            )}
          </section>
        </div>
        {/* Right column */}
        <aside className="w-full lg:w-80 xl:w-96 space-y-5">
          <CourseIncludes/>
          <CourseTeacherCard course={courseDetail} />
        </aside>
      </main>
    </div>
  );
}
