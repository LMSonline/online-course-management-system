// src/app/(learner)/courses/[slug]/page.tsx
import { notFound } from "next/navigation";
import { CourseHero } from "@/core/components/learner/course/CourseHero";
import { CourseWhatYouWillLearn } from "@/core/components/learner/course/CourseWhatYouWillLearn";
import { CourseIncludes } from "@/core/components/learner/course/CourseIncludes";
import { CourseContentOutline } from "@/core/components/learner/course/CourseContentOutline";
import { CourseTeacherCard } from "@/core/components/learner/course/CourseTeacherCard";
import { CourseStudentFeedback } from "@/core/components/learner/course/CourseStudentFeedback";
import { MOCK_COURSE } from "@/lib/learner/course/types";

export default function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // TODO: fetch from API by slug
  const course = MOCK_COURSE.id === params.slug ? MOCK_COURSE : null;

  if (!course) return notFound();

  return (
    <div className="bg-slate-950 text-slate-50">
      <CourseHero course={course} />

      <main className="mx-auto flex w-full max-w-6xl xl:max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-10 xl:px-0 py-6 md:py-8 lg:flex-row">
        {/* Left column */}
        <div className="flex-1 space-y-5">
          <CourseWhatYouWillLearn course={course} />
          <CourseContentOutline course={course} />

          <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5">
            <h2 className="text-lg md:text-xl font-semibold mb-3">Description</h2>
            <p className="text-sm md:text-[15px] text-slate-200 leading-relaxed">
              {course.description}
            </p>
          </section>

          <CourseStudentFeedback course={course} />
        </div>

        {/* Right column */}
        <aside className="w-full lg:w-80 xl:w-96 space-y-5">
          <CourseIncludes course={course} />
          <CourseTeacherCard course={course} />
        </aside>
      </main>
    </div>
  );
}
