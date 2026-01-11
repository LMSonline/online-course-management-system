// src/components/learner/course/CourseContentOutline.tsx
import { useStudentCourseStructure } from "@/hooks/learner/useStudentCourseOutline";
import { ChevronDown, PlayCircle } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  duration: string;
  previewable?: boolean;
};

type Section = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export function CourseContentOutline({ courseId }: { courseId: number }) {
  const { data, isLoading, isError, error } = useStudentCourseStructure(courseId);

  if (isLoading) return <div className="p-4">Loading course outline...</div>;

  // Nếu lỗi 401 (chưa enroll) thì render button Enroll now
  // Kiểm tra error là AxiosError và có response status 401
  const isAxios401 =
    isError &&
    error &&
    typeof error === 'object' &&
    'isAxiosError' in error &&
    (error as any).isAxiosError &&
    (error as any).response?.status === 401;

  if (isAxios401) {
    return (
      <div className="p-4 flex flex-col items-center gap-3">
        <div className="text-red-400 mb-2">You need to enroll to view the course content.</div>
        <button className="px-4 py-2 rounded bg-[var(--brand-400)] text-white font-semibold hover:bg-[var(--brand-500)] transition">
          Enroll now
        </button>
      </div>
    );
  }

  // Nếu lỗi khác hoặc không có data
  if (isError || !data) {
    return <div className="p-4 text-red-400">Failed to load course outline.</div>;
  }

  const sections: Section[] = data.sections || [];
  const totalLectures = sections.reduce((sum, s) => sum + (s.lessons?.length || 0), 0);

  // Nếu không có section/chapter thì render Coming soon
  if (!sections || sections.length === 0) {
    return (
      <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-6 text-center">
        <div className="text-lg font-semibold text-slate-300">Coming soon</div>
        <div className="text-slate-500 mt-2">Course outline will be updated soon.</div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90">
      <header className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-white/10">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">Course content</h2>
          <p className="text-xs text-slate-400 mt-1">
            {sections.length} sections • {totalLectures} lectures
          </p>
        </div>
        <button className="text-xs text-[var(--brand-300)] hover:text-[var(--brand-100)]">
          Expand all
        </button>
      </header>
      <div className="divide-y divide-white/10">
        {sections.map((sec) => (
          <details key={sec.id} className="group" open>
            <summary className="flex cursor-pointer items-center justify-between px-4 md:px-5 py-3 text-sm hover:bg-slate-900/80">
              <div className="flex items-center gap-2">
                <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition" />
                <span className="font-medium">{sec.title}</span>
              </div>
              <div className="text-xs text-slate-400">
                {sec.lessons?.length || 0} lectures
              </div>
            </summary>
            <div className="px-4 md:px-5 py-2 space-y-2 text-xs text-slate-300">
              {sec.lessons && sec.lessons.length > 0 ? (
                sec.lessons.map((lesson: Lesson, idx: number) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 ${lesson.previewable ? "bg-slate-900/80" : "hover:bg-slate-900/60"}`}
                  >
                    <PlayCircle className={`w-4 h-4 ${lesson.previewable ? "text-[var(--brand-400)]" : "text-slate-500"}`} />
                    <span>
                      Lesson {idx + 1} • {lesson.title}
                    </span>
                    <span className="ml-auto text-[11px] text-slate-400">
                      {lesson.duration}
                    </span>
                  </div>
                ))
              ) : (
                <div className="italic text-slate-500">No lessons</div>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
