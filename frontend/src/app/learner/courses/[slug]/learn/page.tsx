"use client";
// src/app/(learner)/courses/[slug]/learn/page.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";


/**
 * FULL DEMO (production-ish) learn page
 * - Entry state: title above player = "What do you want to learn?" + Continue card
 * - Curriculum: Chapters -> Lessons
 * - Lesson content: 0-3 videos, 0-3 attachments, optional quiz
 * - Student can open videos/attachments in any order
 * - Quiz locked until ALL videos in lesson are watched
 * - Multi-video: student selects which video to play
 */

// -----------------------------
// Types
// -----------------------------

type AttachmentType = "pdf" | "doc" | "link" | "zip";

type VideoItem = {
  id: string;
  title: string;
  duration: string;
  url: string;
};

type Attachment = {
  id: string;
  title: string;
  type: AttachmentType;
  url: string;
};

type QuizQuestion = {
  id: string;
  prompt: string;
  options: { id: string; label: string; isCorrect?: boolean }[];
};

type Quiz = {
  id: string;
  title: string;
  passingScore: number; // 0..1
  questions: QuizQuestion[];
};

type Lesson = {
  id: string;
  title: string;
  description?: string;
  videos: VideoItem[]; // 0..3
  attachments: Attachment[]; // 0..3
  quiz?: Quiz; // 0..1
};

type Chapter = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type Course = {
  id: string;
  title: string;
  subtitle?: string;
  chapters: Chapter[];
};

// -----------------------------
// Demo Data (rich)
// -----------------------------

const PUBLIC_MP4 = {
  bunny: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  sintel: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  elephants: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  joyrides: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  blazes: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
};

const DEMO_COURSE: Course = {
  id: "course-react-ultimate",
  title: "What do you want to learn?",
  subtitle: "Pick a lesson, explore materials, and unlock quizzes by finishing videos.",
  chapters: [
    {
      id: "ch1",
      title: "Chapter 1 · Orientation",
      lessons: [
        {
          id: "l1",
          title: "Welcome & How this course works",
          description:
            "Get the lay of the land. You can open videos and attachments in any order, but quizzes unlock only after videos are finished.",
          videos: [
            { id: "v1", title: "Roadmap & outcomes", duration: "04:32", url: PUBLIC_MP4.bunny },
          ],
          attachments: [
            {
              id: "a1",
              title: "Course roadmap (PDF)",
              type: "pdf",
              url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            },
            {
              id: "a2",
              title: "Community link",
              type: "link",
              url: "https://developer.mozilla.org/",
            },
          ],
          quiz: {
            id: "q1",
            title: "Orientation check",
            passingScore: 0.8,
            questions: [
              {
                id: "q1-1",
                prompt: "When does the quiz unlock?",
                options: [
                  { id: "o1", label: "Immediately" },
                  { id: "o2", label: "After all lesson videos are finished", isCorrect: true },
                  { id: "o3", label: "After downloading attachments" },
                ],
              },
              {
                id: "q1-2",
                prompt: "Can you open attachments before videos?",
                options: [
                  { id: "o1", label: "No" },
                  { id: "o2", label: "Yes", isCorrect: true },
                ],
              },
              {
                id: "q1-3",
                prompt: "How many videos can a lesson contain in this demo?",
                options: [
                  { id: "o1", label: "Exactly 1" },
                  { id: "o2", label: "0 to 3", isCorrect: true },
                  { id: "o3", label: "Unlimited" },
                ],
              },
              {
                id: "q1-4",
                prompt: "Your progress is tracked at what level?",
                options: [
                  { id: "o1", label: "Per lesson video (watched)", isCorrect: true },
                  { id: "o2", label: "Only at course level" },
                ],
              },
              {
                id: "q1-5",
                prompt: "What happens if a lesson has 0 videos?",
                options: [
                  { id: "o1", label: "Quiz can unlock immediately (if it exists)", isCorrect: true },
                  { id: "o2", label: "Quiz is always locked" },
                ],
              },
            ],
          },
        },
        {
          id: "l2",
          title: "Setup & tooling (0 videos + attachments only)",
          description: "A lesson can contain only attachments, no videos.",
          videos: [],
          attachments: [
            {
              id: "a3",
              title: "Starter repo (link)",
              type: "link",
              url: "https://nextjs.org/docs",
            },
            {
              id: "a4",
              title: "VSCode extensions (doc)",
              type: "doc",
              url: "https://www.rfc-editor.org/rfc/rfc2616",
            },
          ],
          quiz: {
            id: "q2",
            title: "Tooling quick check",
            passingScore: 0.66,
            questions: [
              {
                id: "q2-1",
                prompt: "Should you use TypeScript for production apps?",
                options: [
                  { id: "o1", label: "Yes", isCorrect: true },
                  { id: "o2", label: "No" },
                ],
              },
              {
                id: "q2-2",
                prompt: "Which command typically starts a Next.js dev server?",
                options: [
                  { id: "o1", label: "npm run dev", isCorrect: true },
                  { id: "o2", label: "npm run start" },
                  { id: "o3", label: "npm run build" },
                ],
              },
              {
                id: "q2-3",
                prompt: "Is it okay to open attachments before anything else?",
                options: [
                  { id: "o1", label: "Yes", isCorrect: true },
                  { id: "o2", label: "No" },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      id: "ch2",
      title: "Chapter 2 · Core Concepts",
      lessons: [
        {
          id: "l3",
          title: "React mental model (2 videos + attachment + quiz)",
          description:
            "This lesson has multiple videos. Finish both videos to unlock the quiz.",
          videos: [
            { id: "v2", title: "Components & composition", duration: "08:20", url: PUBLIC_MP4.sintel },
            { id: "v3", title: "State, props, re-render", duration: "09:40", url: PUBLIC_MP4.elephants },
          ],
          attachments: [
            {
              id: "a5",
              title: "React cheat sheet (PDF)",
              type: "pdf",
              url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            },
          ],
          quiz: {
            id: "q3",
            title: "React basics",
            passingScore: 0.75,
            questions: [
              {
                id: "q3-1",
                prompt: "State updates can trigger what?",
                options: [
                  { id: "o1", label: "A re-render", isCorrect: true },
                  { id: "o2", label: "A database migration" },
                  { id: "o3", label: "A CSS compilation" },
                ],
              },
              {
                id: "q3-2",
                prompt: "Props flow is typically...",
                options: [
                  { id: "o1", label: "Top-down", isCorrect: true },
                  { id: "o2", label: "Bottom-up" },
                  { id: "o3", label: "Random" },
                ],
              },
              {
                id: "q3-3",
                prompt: "Composition encourages...",
                options: [
                  { id: "o1", label: "Small reusable components", isCorrect: true },
                  { id: "o2", label: "One giant component" },
                ],
              },
              {
                id: "q3-4",
                prompt: "Which hook is commonly used for state?",
                options: [
                  { id: "o1", label: "useState", isCorrect: true },
                  { id: "o2", label: "useVideo" },
                  { id: "o3", label: "useServer" },
                ],
              },
            ],
          },
        },
        {
          id: "l4",
          title: "Practice lab (3 videos, no quiz)",
          description: "This lesson is practice-focused and has no quiz.",
          videos: [
            { id: "v4", title: "Lab intro", duration: "03:05", url: PUBLIC_MP4.joyrides },
            { id: "v5", title: "Build the UI", duration: "12:18", url: PUBLIC_MP4.blazes },
            { id: "v6", title: "Refactor & ship", duration: "07:44", url: PUBLIC_MP4.bunny },
          ],
          attachments: [
            {
              id: "a6",
              title: "Lab checklist (link)",
              type: "link",
              url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video",
            },
          ],
        },
      ],
    },
  ],
};

// -----------------------------
// Helpers
// -----------------------------

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatPct(n: number) {
  const v = Math.max(0, Math.min(100, Math.round(n)));
  return `${v}%`;
}

function attachmentIcon(type: AttachmentType) {
  switch (type) {
    case "pdf":
      return "📄";
    case "doc":
      return "📝";
    case "zip":
      return "🗜️";
    case "link":
    default:
      return "🔗";
  }
}

// -----------------------------
// Page
// -----------------------------

// Final quiz data
const FINAL_QUIZ: Quiz = {
  id: "final",
  title: "Final Assessment",
  passingScore: 0.7,
  questions: [...Array(10)].map((_, i) => ({
    id: `fq-${i}`,
    prompt: `Final question ${i + 1}`,
    options: [
      { id: "a", label: "Answer A" },
      { id: "b", label: "Answer B" },
      { id: "c", label: "Answer C", isCorrect: true },
    ],
  })),
};

export default function LearnPage() {
  // Persist minimal learner state in-memory for demo
  // watchedVideos[lessonId] = Set(videoId)
  const [watchedVideos, setWatchedVideos] = useState<Record<string, Record<string, boolean>>>({});
  const [passedQuiz, setPassedQuiz] = useState<Record<string, boolean>>({});

  // Entry state
  const [hasStarted, setHasStarted] = useState(false);

  // Selection state
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"videos" | "attachments" | "quiz">("videos");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // Video control
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Report lesson modal/toast state
  const [reportLesson, setReportLesson] = useState<Lesson | null>(null);
  const [showReportToast, setShowReportToast] = useState(false);

  // Final quiz unlock state
  const [finalQuizUnlocked, setFinalQuizUnlocked] = useState(false);
  const [showFinalQuizToast, setShowFinalQuizToast] = useState(false);

  // Final quiz UI state
  const [activeMode, setActiveMode] = useState<"lesson" | "finalQuiz">("lesson");
  const [finalQuizAttempts, setFinalQuizAttempts] = useState(0);
  const [finalQuizPassed, setFinalQuizPassed] = useState(false);

  // Lesson quiz state
  const [doingLessonQuiz, setDoingLessonQuiz] = useState(false);
  const [lessonQuizAnswers, setLessonQuizAnswers] = useState<Record<string, string>>({});

  // New states for certificate and quiz timer
  const [showCert, setShowCert] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [quizTimeLeft, setQuizTimeLeft] = useState<number>(300); // 5 min default
  const [quizKey, setQuizKey] = useState(0);

  const allLessons = useMemo(() => {
    const out: Lesson[] = [];
    for (const ch of DEMO_COURSE.chapters) out.push(...ch.lessons);
    return out;
  }, []);

  const selectedLesson = useMemo(() => {
    if (!selectedLessonId) return null;
    return allLessons.find((l) => l.id === selectedLessonId) ?? null;
  }, [allLessons, selectedLessonId]);

  // Compute progress by watched videos + passed quiz as "bonus" (optional)
  const progress = useMemo(() => {
    const totalVideos = allLessons.reduce((sum, l) => sum + l.videos.length, 0);
    const watchedCount = allLessons.reduce((sum, l) => {
      const map = watchedVideos[l.id] ?? {};
      return sum + l.videos.filter((v) => map[v.id]).length;
    }, 0);

    const totalQuiz = allLessons.filter((l) => !!l.quiz).length;
    const passedCount = allLessons.reduce((sum, l) => sum + (passedQuiz[l.id] ? 1 : 0), 0);

    // If no videos exist, base on quizzes; otherwise videos dominate
    if (totalVideos === 0) {
      return totalQuiz === 0 ? 0 : (passedCount / totalQuiz) * 100;
    }

    // 90% weight for video completion, 10% for quiz completion
    const videoPct = watchedCount / totalVideos;
    const quizPct = totalQuiz === 0 ? 0 : passedCount / totalQuiz;
    return (videoPct * 0.9 + quizPct * 0.1) * 100;
  }, [allLessons, watchedVideos, passedQuiz]);

  // Unlock final quiz when progress >= 80%
  useEffect(() => {
    if (progress >= 80 && !finalQuizUnlocked) {
      setFinalQuizUnlocked(true);
      setShowFinalQuizToast(true);
      setTimeout(() => setShowFinalQuizToast(false), 4000);
    }
  }, [progress, finalQuizUnlocked]);

  const continueTarget = useMemo(() => {
    // pick first lesson where some video is not watched OR quiz not passed (if exists)
    for (const lesson of allLessons) {
      const watchedMap = watchedVideos[lesson.id] ?? {};
      const allWatched = lesson.videos.every((v) => watchedMap[v.id]);
      const quizDone = lesson.quiz ? !!passedQuiz[lesson.id] : true;
      if (!allWatched || !quizDone) return lesson;
    }
    return allLessons[0] ?? null;
  }, [allLessons, watchedVideos, passedQuiz]);

  const quizUnlocked = useMemo(() => {
    if (!selectedLesson) return false;
    const watchedMap = watchedVideos[selectedLesson.id] ?? {};
    // If lesson has 0 videos, quiz unlocks immediately
    const allWatched = selectedLesson.videos.every((v) => watchedMap[v.id]);
    return allWatched;
  }, [selectedLesson, watchedVideos]);

  const lessonTitleAbovePlayer = useMemo(() => {
    if (!hasStarted) return "Bachelor of Law - Little B";
    if (!selectedLesson) return "Choose a lesson to begin";
    return selectedLesson.title;
  }, [hasStarted, selectedLesson]);

  // When lesson changes, pick first video (if any)
  useEffect(() => {
    if (!selectedLesson) {
      setActiveVideoId(null);
      return;
    }
    const firstVideo = selectedLesson.videos[0]?.id ?? null;
    setActiveVideoId(firstVideo);
    // keep current tab unless it doesn't exist
    if (selectedLesson.videos.length === 0) setActiveTab("attachments");
    else setActiveTab("videos");
  }, [selectedLessonId]);

  const activeVideo = useMemo(() => {
    if (!selectedLesson) return null;
    if (!activeVideoId) return null;
    return selectedLesson.videos.find((v) => v.id === activeVideoId) ?? null;
  }, [selectedLesson, activeVideoId]);

  const markVideoWatched = (lessonId: string, videoId: string) => {
    setWatchedVideos((prev) => ({
      ...prev,
      [lessonId]: { ...(prev[lessonId] ?? {}), [videoId]: true },
    }));
  };

  const handleContinue = () => {
    setHasStarted(true);
    if (!continueTarget) return;
    setSelectedLessonId(continueTarget.id);
  };

  const handleSelectLesson = (lessonId: string) => {
    setHasStarted(true);
    setSelectedLessonId(lessonId);
    setActiveMode("lesson"); // Exit final quiz focus mode if switching lessons
  };

  const handlePlay = () => {
    if (!hasStarted) {
      handleContinue();
      return;
    }
    videoRef.current?.play().catch(() => {
      // autoplay may be blocked; user can press play in controls
    });
  };

  const isFinalQuiz = activeMode === "finalQuiz";

  // Timer effect for final quiz
  useEffect(() => {
    if (!isFinalQuiz || finalQuizPassed) return;
    if (quizStartTime === null) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - quizStartTime) / 1000);
      setQuizTimeLeft(Math.max(0, 300 - elapsed));
      if (elapsed >= 300) {
        setQuizTimeLeft(0);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinalQuiz, finalQuizPassed, quizStartTime]);

  // Add this effect to start timer when entering final quiz mode
  useEffect(() => {
    if (isFinalQuiz && !finalQuizPassed && quizStartTime === null) {
      setQuizStartTime(Date.now());
      setQuizTimeLeft(300);
    }
  }, [isFinalQuiz, finalQuizPassed, quizStartTime]);

  // Reset quiz questions on retry
  function handleRetryFinalQuiz() {
    setQuizKey(k => k + 1);
    setFinalQuizPassed(false);
    setFinalQuizAttempts(0);
    setQuizStartTime(Date.now());
    setQuizTimeLeft(300);
  }

  // Show/hide certificate modal
  function handleShowCert() {
    setShowCert(true);
  }
  function handleCloseCert() {
    setShowCert(false);
  }

  // -----------------------------
  // Render
  // -----------------------------

  return (
    <div className="min-h-screen bg-[#070B12] text-white">
      {/* ================= Learning Session Header ================= */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0F1623]">
        <div className="mx-auto max-w-[1400px] px-6 py-4 md:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-medium text-white/80">
              Learner
            </span>
            <span>/</span>
            <span className="truncate max-w-[50ch] text-white/70">
              {DEMO_COURSE.id}
            </span>
          </div>

          {/* Main row */}
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Left */}
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
                {lessonTitleAbovePlayer}
              </h1>

              {DEMO_COURSE.subtitle && (
                <p className="mt-1 max-w-2xl text-sm text-white/60">
                  {DEMO_COURSE.subtitle}
                </p>
              )}
            </div>

            {/* Right */}
            <div className="flex flex-col items-end gap-3">
              {/* Progress */}
              <div className="w-72">
                <div className="mb-1.5 flex items-center justify-between text-xs text-white/50">
                  <span>Course progress</span>
                  <span className="font-semibold text-sky-400">
                    {formatPct(progress)}
                  </span>
                </div>

                <div className="h-3.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="
                h-full
                rounded-full
                bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500
                transition-all duration-300
              "
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleContinue}
                className="
            inline-flex items-center gap-2
            rounded-xl
            bg-gradient-to-r from-emerald-500 to-green-500
            px-6 py-3
            text-sm font-semibold text-black
            shadow-[0_10px_30px_rgba(34,197,94,0.35)]
            transition
            hover:from-emerald-400 hover:to-green-400
            focus:outline-none focus:ring-2 focus:ring-emerald-400/40
          "
              >
                {hasStarted ? "Continue learning" : "Start learning"}
                <span className="text-base">→</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Toasts */}
      {showReportToast && (
        <div className="fixed bottom-6 right-6 rounded-xl bg-black/90 px-4 py-3 text-sm text-white border border-white/10 shadow-lg">
          ✅ Report sent successfully
        </div>
      )}
      {showFinalQuizToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black shadow-lg">
          🎉 You’ve unlocked the Final Quiz
        </div>
      )}

      {/* ================= Main Layout ================= */}
      <main
        className="
        relative
        mx-auto
        grid
        max-w-[1400px]
        grid-cols-1
        gap-8
        px-4
        py-8
        md:grid-cols-[380px_minmax(0,1fr)]
        md:px-8
      "
      >
        {/* ================= Sidebar ================= */}
        <aside
          className={isFinalQuiz ? "pointer-events-none opacity-40 sticky top-[96px] h-fit rounded-2xl border border-white/10 bg-gradient-to-b from-[#0F1B33] via-[#111B30] to-[#0B1220] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)]" : "sticky top-[96px] h-fit rounded-2xl border border-white/10 bg-gradient-to-b from-[#0F1B33] via-[#111B30] to-[#0B1220] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"}
        >
          <div className="flex items-center justify-between px-1">
            <div className="text-base font-semibold text-white">
              Curriculum
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-medium text-white/70">
              {DEMO_COURSE.chapters.length} chapters
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {DEMO_COURSE.chapters.map((ch) => (
              <ChapterCard
                key={ch.id}
                chapter={ch}
                selectedLessonId={selectedLessonId}
                watchedVideos={watchedVideos}
                passedQuiz={passedQuiz}
                onSelectLesson={handleSelectLesson}
                setReportLesson={setReportLesson}
              />
            ))}
          </div>

          {/* Final Quiz button */}
          {finalQuizUnlocked && (
            <div
              onClick={() => setActiveMode("finalQuiz")}
              className="
                mt-4
                cursor-pointer
                rounded-xl
                border border-emerald-500/30
                bg-emerald-500/10
                px-4 py-3
                text-sm text-emerald-300
                hover:bg-emerald-500/20
              "
            >
              🎓 Final Quiz
              <div className="mt-1 text-xs text-emerald-200/70">
                2 attempts allowed
              </div>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              📘 Learning rules
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/65">
              <li>Open videos and attachments in any order.</li>
              <li>Quiz unlocks after finishing all lesson videos.</li>
              <li>If a lesson has <b>0 videos</b>, quiz unlocks immediately.</li>
            </ul>
          </div>
        </aside>

        {/* ================= Workspace ================= */}
        <section className="min-w-0 space-y-8">
          {isFinalQuiz ? (
            <div className="rounded-2xl border border-white/10 bg-[#0F1623] p-8">
              {finalQuizPassed ? (
                <div className="text-center">
                  <div className="text-4xl">🎉</div>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Congratulations!</h2>
                  <p className="mt-2 text-white/60">You have completed this course.</p>
                  <div className="mt-6 flex flex-col gap-4 items-center justify-center">
                    <button
                      onClick={handleShowCert}
                      className="rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 px-6 py-3 font-semibold text-black"
                    >
                      View your certificate
                    </button>
                    <button
                      onClick={() => window.location.href = "/learner/courses"}
                      className="rounded-xl bg-gradient-to-r from-gray-400 to-gray-600 px-6 py-3 font-semibold text-white"
                    >
                      Back to explore course
                    </button>
                  </div>
                </div>
              ) : finalQuizAttempts === 1 && !finalQuizPassed ? (
                <div className="text-center">
                  <div className="text-4xl text-red-400">😢</div>
                  <h2 className="mt-3 text-2xl font-semibold text-red-400">You did not pass, please try again!</h2>
                  <button
                    onClick={handleRetryFinalQuiz}
                    className="mt-6 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 px-6 py-3 font-semibold text-black"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-white">Final Quiz</h2>
                  <p className="mt-2 text-sm text-white/60">Attempt {finalQuizAttempts + 1} / 2</p>
                  <p className="mt-2 text-sm text-red-400">Time left: {Math.floor(quizTimeLeft / 60)}:{(quizTimeLeft % 60).toString().padStart(2, "0")}</p>
                  <LessonQuizForm
                    key={quizKey}
                    quiz={FINAL_QUIZ}
                    onSubmit={(passed) => {
                      setFinalQuizAttempts(a => a + 1);
                      if (passed) setFinalQuizPassed(true);
                    }}
                    disabled={finalQuizAttempts >= 2 && !finalQuizPassed || quizTimeLeft === 0}
                  />
                </>
              )}
              {/* Certificate Modal */}
              {showCert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                  <div className="w-full max-w-2xl rounded-2xl bg-white p-8 border border-blue-400 shadow-xl text-center relative">
                    <button
                      onClick={handleCloseCert}
                      className="absolute top-4 right-4 text-gray-500 hover:text-black"
                    >✕</button>
                    <img
                      src="/images/certificate.png"
                      alt="Certificate"
                      className="w-full h-auto rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {!hasStarted ? (
                <ContinueHero onContinue={handleContinue} target={continueTarget} />
              ) : !selectedLesson ? (
                <EmptyState title="Choose a lesson" subtitle="Select a lesson from the curriculum to begin." />
              ) : (
                <>
                  {/* Player */}
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#05070D] shadow-[0_30px_100px_rgba(56,189,248,0.25)]">
                    <div className="aspect-video w-full bg-black">
                      <video
                        ref={videoRef}
                        key={activeVideo?.id}
                        controls
                        className="h-full w-full"
                        preload="metadata"
                        controlsList="nodownload"
                        onEnded={() => activeVideo && markVideoWatched(selectedLesson.id, activeVideo.id)}
                      >
                        <source src={activeVideo?.url} type="video/mp4" />
                      </video>
                    </div>
                  </div>
                  {/* Lesson header */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
                      <span className="rounded-full bg-white/[0.06] px-2 py-1 font-medium">Lesson</span>
                      <span className="text-white/30">•</span>
                      <span className="font-medium">{selectedLesson.id}</span>
                      {passedQuiz[selectedLesson.id] && (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-300">✓ Quiz passed</span>
                      )}
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">{selectedLesson.title}</h2>
                    {selectedLesson.description && (
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/60">{selectedLesson.description}</p>
                    )}
                  </div>
                  
                  {/* Tabs */}
                  <div className={isFinalQuiz ? "pointer-events-none opacity-40" : ""}>
                    <div className="rounded-2xl border border-white/10 bg-[#0F1B33] p-2">
                      <div className="flex flex-wrap gap-2">
                        <TabButton
                          active={activeTab === "videos"}
                          onClick={() => setActiveTab("videos")}
                          disabled={selectedLesson.videos.length === 0}
                          label={`Videos (${selectedLesson.videos.length})`}
                        />
                        <TabButton
                          active={activeTab === "attachments"}
                          onClick={() => setActiveTab("attachments")}
                          disabled={selectedLesson.attachments.length === 0}
                          label={`Attachments (${selectedLesson.attachments.length})`}
                        />
                        <TabButton
                          active={activeTab === "quiz"}
                          onClick={() => setActiveTab("quiz")}
                          disabled={!selectedLesson.quiz}
                          label={selectedLesson.quiz ? `Quiz ${quizUnlocked ? "" : "🔒"}` : "Quiz"}
                        />
                      </div>
                    </div>
                    <div className="mt-4 rounded-2xl border border-white/10 bg-[#111B30] p-5">
                      {activeTab === "videos" ? (
                        <VideosPanel
                          lesson={selectedLesson}
                          activeVideoId={activeVideoId}
                          watchedMap={watchedVideos[selectedLesson.id] ?? {}}
                          onSelectVideo={setActiveVideoId}
                          onMarkWatched={(videoId) => markVideoWatched(selectedLesson.id, videoId)}
                        />
                      ) : activeTab === "attachments" ? (
                        <AttachmentsPanel lesson={selectedLesson} />
                      ) : (
                        <QuizPanel
                          lesson={selectedLesson}
                          unlocked={quizUnlocked}
                          passed={!!passedQuiz[selectedLesson.id]}
                          doingLessonQuiz={doingLessonQuiz}
                          setDoingLessonQuiz={setDoingLessonQuiz}
                          onPass={() => setPassedQuiz((p) => ({ ...p, [selectedLesson.id]: true }))}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </section>
        {/* Report Modal */}
        {reportLesson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="w-full max-w-md rounded-2xl bg-[#0F1623] p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white">
                Report lesson
              </h3>
              <p className="mt-1 text-sm text-white/60">
                {reportLesson.title}
              </p>

              <select className="mt-4 w-full rounded-xl bg-black/30 border border-white/10 p-2 text-sm text-white">
                <option>Video not working</option>
                <option>Wrong content</option>
                <option>Audio issue</option>
                <option>Other</option>
              </select>

              <textarea
                rows={4}
                className="mt-3 w-full rounded-xl bg-black/30 border border-white/10 p-3 text-sm text-white"
                placeholder="Describe the issue..."
              />

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setReportLesson(null)}
                  className="px-4 py-2 text-sm text-white/60"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setReportLesson(null);
                    setShowReportToast(true);
                    setTimeout(() => setShowReportToast(false), 2500);
                  }}
                  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-black"
                >
                  Send report
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// -----------------------------
// UI Components
// -----------------------------

type TabButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function TabButton({
  label,
  active = false,
  disabled = false,
  onClick,
}: TabButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "relative inline-flex items-center justify-center",
        "rounded-xl px-4 py-2.5 text-sm font-medium",
        "transition-all duration-200",
        "focus:outline-none",

        // Disabled
        disabled
          ? "cursor-not-allowed text-white/35 bg-white/[0.04] border border-white/5"
          : active
            ? [
              // Active
              "text-white",
              "bg-[#0F1B33]",
              "border border-emerald-500/40",
              "shadow-[0_0_0_1px_rgba(34,197,94,0.35),0_10px_30px_rgba(34,197,94,0.15)]",
            ].join(" ")
            : [
              // Inactive
              "text-white/70",
              "bg-[#0B1220]",
              "border border-white/10",
              "hover:bg-white/[0.08]",
              "hover:text-white",
            ].join(" "),
      ].join(" ")}
    >
      {/* Active indicator */}
      {active && (
        <span className="pointer-events-none absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-green-500" />
      )}

      {label}
    </button>
  );
}


function ContinueHero({
  onContinue,
  target,
}: {
  onContinue: () => void;
  target: Lesson | null;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-emerald-200/90">Welcome back</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            What do you want to learn?
          </h2>
          <p className="mt-2 text-sm text-white/60 max-w-2xl">
            Explore the curriculum, pick a lesson, and learn your way. Quizzes unlock only after you finish all lesson videos.
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black shadow-sm transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
        >
          Continue learning →
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="text-xs font-semibold text-white/70">Your next lesson</div>
          <div className="mt-2 text-sm font-semibold text-white/90">
            {target ? target.title : "—"}
          </div>
          <div className="mt-1 text-xs text-white/55">
            {target
              ? `${target.videos.length} video(s) · ${target.attachments.length} attachment(s) · ${target.quiz ? "quiz" : "no quiz"}`
              : "No lessons found"}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="text-xs font-semibold text-white/70">How it works</div>
          <ul className="mt-2 list-disc pl-4 text-xs leading-relaxed text-white/55">
            <li>Pick any video and watch to completion to mark it done.</li>
            <li>Attachments are always accessible.</li>
            <li>Quiz unlocks when all videos are completed.</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-white/70">Player</div>
            <div className="mt-1 text-sm text-white/60">Press Continue to begin. The player will load the selected lesson.</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
            ▶ Continue
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
      <div className="text-3xl">✨</div>
      <div className="mt-3 text-lg font-semibold text-white/90">{title}</div>
      <div className="mt-2 text-sm text-white/60">{subtitle}</div>
    </div>
  );
}

function ChapterCard({
  chapter,
  selectedLessonId,
  watchedVideos,
  passedQuiz,
  onSelectLesson,
  setReportLesson,
}: {
  chapter: Chapter;
  selectedLessonId: string | null;
  watchedVideos: Record<string, Record<string, boolean>>;
  passedQuiz: Record<string, boolean>;
  onSelectLesson: (lessonId: string) => void;
  setReportLesson: (lesson: Lesson) => void;
}) {
  const [open, setOpen] = useState(true);

  const stats = useMemo(() => {
    const totalVideos = chapter.lessons.reduce((s, l) => s + l.videos.length, 0);
    const watched = chapter.lessons.reduce((s, l) => {
      const map = watchedVideos[l.id] ?? {};
      return s + l.videos.filter(v => map[v.id]).length;
    }, 0);
    const quizzes = chapter.lessons.filter(l => l.quiz).length;
    const passed = chapter.lessons.reduce((s, l) => s + (passedQuiz[l.id] ? 1 : 0), 0);
    return { totalVideos, watched, quizzes, passed };
  }, [chapter, watchedVideos, passedQuiz]);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-2">
      {/* Chapter header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between rounded-xl bg-black/30 px-4 py-3.5 text-left transition hover:bg-white/[0.06]"
      >
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-white">
            {chapter.title}
          </div>
          <div className="mt-1 text-xs text-white/55">
            {chapter.lessons.length} lessons · {stats.watched}/{stats.totalVideos} videos · {stats.passed}/{stats.quizzes} quizzes
          </div>
        </div>
        <span className="text-white/50">{open ? "▾" : "▸"}</span>
      </button>

      {/* Lessons */}
      {open && (
        <ul className="mt-2 space-y-2.5 px-1">
          {chapter.lessons.map(lesson => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              active={lesson.id === selectedLessonId}
              watchedMap={watchedVideos[lesson.id] ?? {}}
              quizPassed={!!passedQuiz[lesson.id]}
              onClick={() => onSelectLesson(lesson.id)}
              setReportLesson={setReportLesson}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
function LessonRow({
  lesson,
  active,
  watchedMap,
  quizPassed,
  onClick,
  setReportLesson,
}: {
  lesson: Lesson;
  active: boolean;
  watchedMap: Record<string, boolean>;
  quizPassed: boolean;
  onClick: () => void;
  setReportLesson: (lesson: Lesson) => void;
}) {
  const watchedCount = lesson.videos.filter((v) => watchedMap[v.id]).length;
  const allWatched = lesson.videos.length === 0 ? true : watchedCount === lesson.videos.length;
  const quizState = !lesson.quiz ? "—" : quizPassed ? "✓" : allWatched ? "Unlocked" : "🔒";

  return (
    <li className="mt-1">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group w-full rounded-xl border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60",
          active ? "border-emerald-500/30 bg-emerald-500/15" : "border-transparent hover:border-white/10 hover:bg-white/5"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className={cn("truncate text-sm font-medium", active ? "text-white" : "text-white/80 group-hover:text-white/90")}>{lesson.title}</div>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-white/45">
              <span className="tabular-nums">Videos: {watchedCount}/{lesson.videos.length}</span>
              <span className="text-white/25">•</span>
              <span>Attachments: {lesson.attachments.length}</span>
              <span className="text-white/25">•</span>
              <span>Quiz: {quizState}</span>
            </div>
          </div>
          <div className="shrink-0 pt-0.5 flex items-center">
            {quizPassed ? (
              <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">
                ✓ Done
              </span>
            ) : allWatched && lesson.quiz ? (
              <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium text-white/65">
                Ready
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium text-white/45">
                In progress
              </span>
            )}
            <span
              role="button"
              tabIndex={0}
              onClick={e => {
                e.stopPropagation();
                setReportLesson(lesson);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setReportLesson(lesson);
                }
              }}
              className="ml-2 rounded-lg border border-white/10 bg-black/30 px-2 py-0.5 text-[11px] text-white/50 hover:bg-red-500/15 hover:text-red-300 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Report
            </span>
          </div>
        </div>
      </button>
    </li>
  );
}

function VideosPanel({
  lesson,
  activeVideoId,
  watchedMap,
  onSelectVideo,
  onMarkWatched,
}: {
  lesson: Lesson;
  activeVideoId: string | null;
  watchedMap: Record<string, boolean>;
  onSelectVideo: (id: string) => void;
  onMarkWatched: (id: string) => void;
}) {
  if (lesson.videos.length === 0) {
    return (
      <div className="text-sm text-white/60">No videos in this lesson.</div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-white/85">Lesson videos</div>
        <div className="text-xs text-white/50">
          Watch to the end to mark as complete.
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {lesson.videos.map((v, idx) => {
          const isActive = v.id === activeVideoId;
          const watched = !!watchedMap[v.id];
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelectVideo(v.id)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60",
                isActive ? "border-emerald-500/30 bg-emerald-500/10" : "border-white/10 bg-black/20 hover:bg-white/5"
              )}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/45 tabular-nums">{idx + 1}</span>
                  <span className={cn("truncate text-sm font-medium", watched ? "text-white/85" : "text-white/80")}>
                    {v.title}
                  </span>
                  {watched ? (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">
                      ✓ watched
                    </span>
                  ) : null}
                </div>
                <div className="mt-0.5 text-xs text-white/45">Duration · {v.duration}</div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {!watched ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onMarkWatched(v.id);
                    }}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                    title="Demo helper: mark watched"
                  >
                    Mark watched
                  </button>
                ) : null}
                <span className="text-white/50">{isActive ? "▶" : ""}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
        <div className="text-xs font-semibold text-white/70">Tip</div>
        <div className="mt-1 text-xs leading-relaxed text-white/55">
          For real production tracking, replace <span className="text-white/75">onEnded</span> with a 90% watch threshold and persist to backend.
        </div>
      </div>
    </div>
  );
}

function AttachmentsPanel({ lesson }: { lesson: Lesson }) {
  if (lesson.attachments.length === 0) {
    return <div className="text-sm text-white/60">No attachments in this lesson.</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-white/85">Attachments</div>
        <div className="text-xs text-white/50">Always accessible</div>
      </div>

      <div className="mt-3 space-y-2">
        {lesson.attachments.map((a) => (
          <a
            key={a.id}
            href={a.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{attachmentIcon(a.type)}</span>
                <span className="truncate text-sm font-medium text-white/85">{a.title}</span>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-white/60">
                  {a.type.toUpperCase()}
                </span>
              </div>
              <div className="mt-0.5 text-xs text-white/45 truncate">{a.url}</div>
            </div>
            <span className="shrink-0 text-white/50">↗</span>
          </a>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
        <div className="text-xs font-semibold text-white/70">Pro note</div>
        <div className="mt-1 text-xs leading-relaxed text-white/55">
          In production, you might open attachments in an in-app viewer (PDF viewer), track downloads, and add search.
        </div>
      </div>
    </div>
  );
}

type QuizPanelProps = {
  lesson: Lesson;
  unlocked: boolean;
  passed: boolean;
  onPass: () => void;
};

export function QuizPanel({
  lesson,
  unlocked,
  passed,
  doingLessonQuiz,
  setDoingLessonQuiz,
  onPass,
}: QuizPanelProps & { doingLessonQuiz: boolean; setDoingLessonQuiz: (v: boolean) => void }) {
  // ================= PASSED =================
  if (passed) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/15 to-transparent p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.25),transparent_65%)]" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
              ✓
            </div>
            <div>
              <div className="text-lg font-semibold text-white">
                Quiz completed
              </div>
              <div className="text-sm text-white/70">
                You’ve successfully passed this quiz.
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-black/30 p-4 text-sm text-white/65">
            Great job! You can continue learning or move to the next lesson.
          </div>
        </div>
      </div>
    );
  }

  // ================= LOCKED =================
  if (!unlocked) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F1B33] p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_65%)]" />

        <div className="relative text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-xl">
            🔒
          </div>

          <h3 className="mt-4 text-lg font-semibold text-white">
            Quiz locked
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-white/65">
            Finish all lesson videos to unlock this quiz and test your knowledge.
          </p>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4 text-left text-sm text-white/60">
            <ul className="space-y-2">
              <li>• Watch all videos in this lesson</li>
              <li>• Quiz will unlock automatically</li>
              <li>• No manual refresh required</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // ================= UNLOCKED =================
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111B30] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_65%)]" />
      <div className="relative">
        {doingLessonQuiz ? (
          <LessonQuizForm
            quiz={lesson.quiz!}
            onSubmit={(passed) => {
              setDoingLessonQuiz(false);
              if (passed) onPass();
            }}
          />
        ) : (
          <React.Fragment>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Lesson quiz
                </h3>
                <p className="mt-1 text-sm text-white/70">
                  Test your understanding before moving on.
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                Ready
              </span>
            </div>
            <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/65">
              <ul className="space-y-2">
                <li>• Single attempt quiz</li>
                <li>• Immediate result</li>
                <li>• Passing unlocks next content</li>
              </ul>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setDoingLessonQuiz(true)}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-black shadow-[0_10px_30px_rgba(34,197,94,0.35)] transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
              >
                Start quiz
              </button>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
// LessonQuizForm component
function LessonQuizForm({ quiz, onSubmit, disabled }: { quiz: Quiz; onSubmit: (passed: boolean) => void; disabled?: boolean }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const correctCount = quiz.questions.filter(q =>
    q.options.find(o => o.isCorrect)?.id === answers[q.id]
  ).length;
  const score = correctCount / quiz.questions.length;

  return (
    <div className="space-y-6">
      {quiz.questions.map((q, idx) => (
        <div key={q.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
          <div className="text-sm font-semibold text-white">
            {idx + 1}. {q.prompt}
          </div>

          <div className="mt-3 space-y-2">
            {q.options.map(o => (
              <label
                key={o.id}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.08] cursor-pointer"
              >
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === o.id}
                  onChange={() =>
                    setAnswers(a => ({ ...a, [q.id]: o.id }))
                  }
                  disabled={disabled}
                />
                {o.label}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          onClick={() => onSubmit(score >= quiz.passingScore)}
          className={"rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black" + (disabled ? " opacity-50 cursor-not-allowed" : "")}
          disabled={disabled}
        >
          Submit quiz
        </button>
      </div>
    </div>
  );
}
