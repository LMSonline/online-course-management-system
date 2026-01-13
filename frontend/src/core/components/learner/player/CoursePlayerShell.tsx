"use client";


import { useMemo, useState } from "react";
import { Play, Pause, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import type { PlayerCourse, PlayerLesson } from "@/lib/learner/player/types";
import { useParams } from "next/navigation";
import { useCoursePlayerData } from "@/core/hooks/useCoursePlayerData";
import { MOCK_PLAYER_COURSE } from "@/lib/learner/player/types";

type Props = {
  course?: PlayerCourse; // optional, fallback nếu không có API
};

export function CoursePlayerShell({ course: courseProp }: Props) {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const { data: apiCourse, isLoading, error } = useCoursePlayerData(slug);
  const course: PlayerCourse = apiCourse || courseProp || MOCK_PLAYER_COURSE;

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  if (!course) return <div className="p-8 text-center text-red-400">Course not found.</div>;

  const currentSection = course.sections[currentSectionIndex];
  const currentLesson = currentSection.lessons[currentLessonIndex];

  const overallProgress = useMemo(() => {
    const allLessons = course.sections.flatMap((s) => s.lessons);
    if (!allLessons.length) return 0;
    const doneCount = allLessons.filter((l) => completed[l.id]).length;
    return Math.round((doneCount / allLessons.length) * 100);
  }, [course.sections, completed]);

  const handleLessonClick = (sectionIdx: number, lessonIdx: number) => {
    setCurrentSectionIndex(sectionIdx);
    setCurrentLessonIndex(lessonIdx);
    setPlaying(false);
  };

  const handleMarkComplete = (lesson: PlayerLesson) => {
    setCompleted((prev) => ({
      ...prev,
      [lesson.id]: !prev[lesson.id],
    }));
  };

  const goNextLesson = () => {
    const s = currentSectionIndex;
    const l = currentLessonIndex;
    const section = course.sections[s];

    if (l < section.lessons.length - 1) {
      setCurrentLessonIndex(l + 1);
      setPlaying(false);
      return;
    }

    // qua section kế tiếp
    if (s < course.sections.length - 1) {
      setCurrentSectionIndex(s + 1);
      setCurrentLessonIndex(0);
      setPlaying(false);
    }
  };

  const goPrevLesson = () => {
    const s = currentSectionIndex;
    const l = currentLessonIndex;

    if (l > 0) {
      setCurrentLessonIndex(l - 1);
      setPlaying(false);
      return;
    }

    if (s > 0) {
      const prevSection = course.sections[s - 1];
      setCurrentSectionIndex(s - 1);
      setCurrentLessonIndex(prevSection.lessons.length - 1);
      setPlaying(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-50 min-h-screen">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:px-10 py-4 md:py-6 lg:flex-row">
        {/* LEFT: video + thông tin bài học */}
        <div className="flex-1 min-w-0 space-y-4 md:space-y-5">
          {/* Breadcrumb / heading nhỏ */}
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="truncate">{course.title}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="truncate text-slate-200">
              {currentLesson.title}
            </span>
          </div>

          {/* Video player với tiêu đề động */}
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-[0_0_40px_rgba(15,23,42,0.9)] mb-2">
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
              <h2 className="text-lg font-semibold">
                {currentSectionIndex === 0 && currentLessonIndex === 0 ? "Getting Started" : currentLesson.title}
              </h2>
            </div>
            <div className="relative aspect-video w-full bg-slate-900">
              {/* Nếu là YouTube thì dùng iframe, nếu là mp4 thì dùng video */}
              {currentLesson.videoUrl.includes("youtube.com") ? (
                <iframe
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={currentLesson.videoUrl}
                  controls
                  className="h-full w-full object-cover"
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                />
              )}
              {/* Overlay nhẹ khi chưa play (optional) */}
              {!playing && (
                <div className="pointer-events-none absolute inset-0 bg-black/20" />
              )}
            </div>
          </section>

          {/* Info current lesson + nút điều hướng */}
          <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 space-y-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--brand-300)] mb-1">
                  Lesson {currentLessonIndex + 1} · {currentSection.title}
                </p>
                <h1 className="text-lg md:text-xl font-semibold">
                  {currentLesson.title}
                </h1>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {currentLesson.duration}
                  </span>
                  {currentLesson.isPreview && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-slate-600" />
                      <span className="text-emerald-300">Preview</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleMarkComplete(currentLesson)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-900 px-4 py-2 text-xs md:text-sm font-medium text-slate-100 hover:bg-slate-800 transition"
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      completed[currentLesson.id]
                        ? "text-emerald-400"
                        : "text-slate-400"
                    }`}
                  />
                  {completed[currentLesson.id] ? "Mark as incomplete" : "Mark as complete"}
                </button>
              </div>
            </div>

            {/* Buttons prev / next */}
            <div className="flex flex-col gap-2 pt-1 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={goPrevLesson}
                  className="rounded-full border border-white/20 bg-slate-950 px-4 py-2 text-xs md:text-sm font-medium text-slate-100 hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  disabled={
                    currentSectionIndex === 0 && currentLessonIndex === 0
                  }
                >
                  Previous lesson
                </button>
                <button
                  type="button"
                  onClick={goNextLesson}
                  className="rounded-full bg-[var(--brand-600)] px-4 py-2 text-xs md:text-sm font-semibold text-slate-950 hover:bg-[var(--brand-700)] disabled:opacity-40 disabled:cursor-not-allowed transition"
                  disabled={
                    currentSectionIndex === course.sections.length - 1 &&
                    currentLessonIndex ===
                      course.sections[currentSectionIndex].lessons.length - 1
                  }
                >
                  Next lesson
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-slate-950 px-4 py-2 text-xs md:text-sm font-medium text-slate-100 hover:bg-slate-900 transition self-start md:self-auto"
              >
                {playing ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Play
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Tabs mô tả / tài liệu / ghi chú – tạm mock đơn giản */}
          <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 space-y-3">
            <div className="flex gap-2 text-xs md:text-sm">
              <button className="rounded-full bg-slate-900 px-3 py-1.5 font-medium text-[var(--brand-100)]">
                Overview
              </button>
              <button className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-slate-900">
                Resources
              </button>
              <button className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-slate-900">
                Notes
              </button>
            </div>

            <p className="text-sm text-slate-300">
              Đây là khu vực mô tả bài giảng, tóm tắt nội dung chính hoặc ghi chú
              quan trọng cho người học. Sau này có thể bind từ API (lesson
              description, transcript, downloadable files, v.v.).
            </p>
          </section>
        </div>

        {/* RIGHT: curriculum / danh sách bài học */}
        <aside className="w-full lg:w-80 xl:w-96 space-y-4">
          {/* Progress tổng */}
          <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span>Course progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--brand-600)]"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Lessons marked as complete will update your progress.
            </p>
          </section>

          {/* Curriculum */}
          <section className="rounded-2xl border border-white/10 bg-slate-950/90 max-h-[520px] overflow-y-auto">
            {course.sections.map((sec, secIdx) => (
              <details
                key={sec.id}
                open={secIdx === currentSectionIndex}
                className="group border-b border-white/5 last:border-none"
              >
                <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-xs md:text-sm hover:bg-slate-900/80">
                  <span className="font-medium text-slate-100">
                    {sec.title}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {sec.lessons.length} lessons
                  </span>
                </summary>

                <div className="px-3 py-2 space-y-1 text-xs text-slate-200">
                  {sec.lessons.map((les, lesIdx) => {
                    const isActive =
                      secIdx === currentSectionIndex &&
                      lesIdx === currentLessonIndex;
                    const isCompleted = completed[les.id];

                    return (
                      <button
                        key={les.id}
                        type="button"
                        onClick={() => handleLessonClick(secIdx, lesIdx)}
                        className={[
                          "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left transition",
                          isActive
                            ? "bg-[var(--brand-600)]/20 text-[var(--brand-50)]"
                            : "hover:bg-slate-900",
                        ].join(" ")}
                      >
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-slate-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{les.title}</p>
                          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-400">
                            <span>{les.duration}</span>
                            {les.isPreview && (
                              <>
                                <span className="h-1 w-1 rounded-full bg-slate-600" />
                                <span>Preview</span>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </details>
            ))}
          </section>
        </aside>
      </main>
    </div>
  );
}
