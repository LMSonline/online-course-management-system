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
import { use, useState } from "react";

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params); // <-- dùng React.use để unwrap Promise
  const { courseDetail, comments: initialComments, ratingSummary, loading, loadingComments, loadingRating } = useCourseDetail(slug);

  // Sample comments data with instructor replies
  type Comment = {
    id: number;
    courseId?: number;
    lessonId?: number;
    parentId?: number;
    studentId?: number;
    username?: string;
    avatarUrl?: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    replies?: Comment[];
  };

  const sampleComments: Comment[] = [
    {
      id: 1,
      username: "Nguyễn Văn A",
      content: "Khóa học rất bổ ích, giảng viên dạy dễ hiểu và nhiệt tình!",
      createdAt: "2026-01-10",
      updatedAt: "2026-01-10",
      replies: [
        {
          id: 101,
          username: "TS. Trần Thị Hương",
          content: "Cảm ơn bạn đã tham gia và đánh giá tích cực! Nếu có thắc mắc gì thêm, bạn cứ hỏi nhé.",
          createdAt: "2026-01-10",
          updatedAt: "2026-01-10",
        },
      ],
    },
    {
      id: 2,
      username: "Trần Thị B",
      content: "Nội dung cập nhật, thực tế, phù hợp với sinh viên.",
      createdAt: "2026-01-09",
      updatedAt: "2026-01-09",
      replies: [
        {
          id: 102,
          username: "TS. Trần Thị Hương",
          content: "Cảm ơn bạn đã góp ý! Cô sẽ tiếp tục cập nhật thêm nhiều nội dung thực tiễn hơn nữa.",
          createdAt: "2026-01-09",
          updatedAt: "2026-01-09",
        },
      ],
    },
    {
      id: 3,
      username: "Lê Văn C",
      content: "Mong muốn có thêm nhiều ví dụ thực tiễn hơn nữa.",
      createdAt: "2026-01-08",
      updatedAt: "2026-01-08",
      replies: [
        {
          id: 103,
          username: "TS. Trần Thị Hương",
          content: "Cảm ơn bạn đã góp ý, cô sẽ bổ sung thêm ví dụ thực tiễn trong các bài học tiếp theo!",
          createdAt: "2026-01-08",
          updatedAt: "2026-01-08",
        },
      ],
    },
    {
      id: 4,
      username: "Phạm Thị D",
      content: "Giảng viên rất thân thiện, giải đáp thắc mắc nhanh chóng.",
      createdAt: "2026-01-07",
      updatedAt: "2026-01-07",
      replies: [
        {
          id: 104,
          username: "TS. Trần Thị Hương",
          content: "Cảm ơn bạn! Sự hài lòng của các bạn là động lực để cô cố gắng hơn.",
          createdAt: "2026-01-07",
          updatedAt: "2026-01-07",
        },
      ],
    },
    {
      id: 5,
      username: "Hoàng Văn E",
      content: "Khóa học phù hợp cho người mới bắt đầu.",
      createdAt: "2026-01-06",
      updatedAt: "2026-01-06",
      replies: [
        {
          id: 105,
          username: "TS. Trần Thị Hương",
          content: "Cảm ơn bạn! Nếu cần hỗ trợ thêm, bạn cứ liên hệ với cô nhé.",
          createdAt: "2026-01-06",
          updatedAt: "2026-01-06",
        },
      ],
    },
  ];

  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<Comment[]>(sampleComments);

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    setComments([
      {
        id: Date.now(),
        username: "ngochannt",
        content: commentInput,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
        replies: [],
      },
      ...comments,
    ]);
    setCommentInput("");
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!courseDetail) return notFound();

  return (
    <div className="bg-slate-950 text-slate-50">
      <CourseHero course={{ ...courseDetail, thumbnailUrl: courseDetail.thumbnailUrl }} />
      <main className="mx-auto flex w-full max-w-6xl xl:max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-10 xl:px-0 py-6 md:py-8 lg:flex-row">
        {/* Left column */}
        <div className="flex-1 space-y-5">
          <CourseWhatYouWillLearn />
          <CourseContentOutline />
          <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5">
            <h2 className="text-lg md:text-xl font-semibold mb-3">Description</h2>
            <p className="text-sm md:text-[15px] text-slate-200 leading-relaxed">{courseDetail.description}</p>
          </section>
          <CourseStudentFeedback />
          {/* Bình luận */}
          <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-950 to-slate-900 p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
  {/* subtle accent */}
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_60%)]" />

  <div className="relative">
    {/* Header */}
    <h2 className="mb-5 text-base md:text-lg font-semibold text-white">
      Comments
    </h2>

    {/* Comment input */}
    <div className="mb-6 flex gap-3">
      <input
        type="text"
        className="flex-1 rounded-lg border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        placeholder="Viết bình luận của bạn..."
        value={commentInput}
        onChange={e => setCommentInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleAddComment(); }}
      />
      <button
        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition"
        onClick={handleAddComment}
      >
        Gửi
      </button>
    </div>

    <ul className="space-y-6">
      {comments.map((c) => (
        <li key={c.id}>
          {/* Main comment */}
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-sm font-semibold text-slate-300">
                {c.username?.charAt(0) ?? "U"}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">
                  {c.username}
                </span>
                <span className="text-xs text-slate-400">
                  {c.createdAt}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                {c.content}
              </p>
            </div>
          </div>

          {/* Replies */}
          {c.replies && c.replies.length > 0 && (
            <ul className="mt-4 space-y-3">
              {c.replies.map((r) => (
                <li key={r.id} className="ml-10">
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xs font-semibold text-emerald-300">
                        {r.username?.charAt(0) ?? "I"}
                      </div>
                    </div>

                    {/* Reply content */}
                    <div className="flex-1 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-emerald-300">
                            {r.username}
                          </span>
                          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                            Instructor
                          </span>
                        </div>

                        <span className="text-xs text-slate-400">
                          {r.createdAt}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-100 leading-relaxed">
                        {r.content}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  </div>
</section>

        </div>
        {/* Right column */}
        <aside className="w-full lg:w-80 xl:w-96 space-y-5">
          <CourseIncludes />
          <CourseTeacherCard />
        </aside>
      </main>
    </div>
  );
}
