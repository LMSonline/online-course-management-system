"use client";
import { useState } from "react";

import { MyCourseRow as MyCourse } from "./MyCourse";
import { CourseCardMini } from "./CourseCardMini";
import { CertificateCard } from "./CertificateCard";

import { EmptyState } from "@/core/components/teacher/courses/EmptyState";

const TABS = ["All courses", "My lists", "Archived"] as const;
type TabKey = typeof TABS[number];

export default function MyCoursesSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("All courses");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const size = 16;
  // Mock data cho All courses
  const mockCourses = [
    {
      id: "1",
      slug: "react-for-beginners",
      title: "React for Beginners",
      progress: 40,
      rating: 4.7,
      level: "Beginner" as const,
      category: "Web Development",
      instructor: "John Doe",
      lastViewed: "2026-01-10",
      thumbnailUrl: "/images/course/image_1.png",
      thumbColor: "from-blue-500 to-cyan-400",
    },
    {
      id: "2",
      slug: "typescript-mastery",
      title: "TypeScript Mastery",
      progress: 80,
      rating: 4.9,
      level: "Intermediate" as const,
      category: "Programming",
      instructor: "Jane Smith",
      lastViewed: "2026-01-09",
      thumbnailUrl: "/images/course/image_2.png",
      thumbColor: "from-purple-500 to-indigo-400",
    },
    {
      id: "3",
      slug: "nextjs-in-practice",
      title: "Next.js in Practice",
      progress: 10,
      rating: 4.5,
      level: "Intermediate" as const,
      category: "Web Framework",
      instructor: "Alex Lee",
      lastViewed: "2026-01-08",
      thumbnailUrl: "/images/course/image_3.png",
      thumbColor: "from-gray-700 to-gray-900",
    },
    {
      id: "4",
      slug: "python-data-science",
      title: "Python for Data Science",
      progress: 65,
      rating: 4.8,
      level: "Beginner" as const,
      category: "Data Science",
      instructor: "Emily Chen",
      lastViewed: "2026-01-07",
      thumbnailUrl: "/images/course/image_4.png",
      thumbColor: "from-yellow-400 to-green-400",
    },
    {
      id: "5",
      slug: "ui-ux-design-fundamentals",
      title: "UI/UX Design Fundamentals",
      progress: 25,
      rating: 4.6,
      level: "Beginner" as const,
      category: "Design",
      instructor: "Michael Brown",
      lastViewed: "2026-01-06",
      thumbnailUrl: "/images/course/image_5.png",
      thumbColor: "from-pink-400 to-red-400",
    },
  ];

  // Mock data cho My lists
  const myListCourses = [
    {
      id: "6",
      slug: "vuejs-essentials",
      title: "Vue.js Essentials",
      progress: 0,
      rating: 4.3,
      level: "Beginner" as const,
      category: "Frontend",
      instructor: "Anna Nguyen",
      lastViewed: "2026-01-05",
      thumbnailUrl: "/images/course/image_6.png",
      thumbColor: "from-green-400 to-blue-400",
    },
    {
      id: "7",
      slug: "golang-microservices",
      title: "Golang Microservices",
      progress: 0,
      rating: 4.2,
      level: "Advanced" as const,
      category: "Backend",
      instructor: "David Tran",
      lastViewed: "2026-01-04",
      thumbnailUrl: "/images/course/image_7.png",
      thumbColor: "from-yellow-400 to-orange-400",
    },
  ];

  // Mock data cho Archived (certificate)
  const archivedCertificates = [
    {
      id: "cert-1",
      courseTitle: "React for Beginners",
      date: "2025-12-01",
      certificateUrl: "/certificates/react-beginner.pdf",
    },
    {
      id: "cert-2",
      courseTitle: "Python for Data Science",
      date: "2025-11-15",
      certificateUrl: "/certificates/python-ds.pdf",
    },
  ];

  // Add mock Queue Lists and lessons
  const mockQueueLists = [
    {
      id: "queue-1",
      name: "Frontend Mastery",
      created: "2026-01-05",
      lessons: [
        {
          id: "l1",
          slug: "react-hooks",
          title: "React Hooks Deep Dive",
          progress: 0,
          rating: 4.8,
          level: "Intermediate",
          category: "Web Development",
          instructor: "John Doe",
          lastViewed: "2026-01-10",
          thumbnailUrl: "/images/course/image_8.png",
          thumbColor: "from-blue-500 to-cyan-400",
        },
        {
          id: "l2",
          slug: "css-grid-flexbox",
          title: "CSS Grid & Flexbox",
          progress: 0,
          rating: 4.7,
          level: "Beginner",
          category: "Web Design",
          instructor: "Jane Smith",
          lastViewed: "2026-01-09",
          thumbnailUrl: "/images/course/image_9.png",
          thumbColor: "from-pink-400 to-purple-400",
        },
      ],
    },
    {
      id: "queue-2",
      name: "Backend Essentials",
      created: "2026-01-03",
      lessons: [
        {
          id: "l3",
          slug: "nodejs-api",
          title: "Node.js API Development",
          progress: 0,
          rating: 4.6,
          level: "Intermediate",
          category: "Backend",
          instructor: "Alex Lee",
          lastViewed: "2026-01-08",
          thumbnailUrl: "/images/course/image_10.png",
          thumbColor: "from-gray-700 to-gray-900",
        },
        {
          id: "l4",
          slug: "mongodb-basics",
          title: "MongoDB Basics",
          progress: 0,
          rating: 4.5,
          level: "Beginner",
          category: "Database",
          instructor: "Emily Chen",
          lastViewed: "2026-01-07",
          thumbnailUrl: "/images/course/image_11.png",
          thumbColor: "from-green-400 to-blue-400",
        },
      ],
    },
    {
      id: "queue-3",
      name: "Fullstack Path",
      created: "2026-01-01",
      lessons: [
        {
          id: "l5",
          slug: "typescript-advanced",
          title: "Advanced TypeScript",
          progress: 0,
          rating: 4.9,
          level: "Advanced",
          category: "Programming",
          instructor: "David Tran",
          lastViewed: "2026-01-04",
          thumbnailUrl: "/images/course/image_12.png",
          thumbColor: "from-yellow-400 to-orange-400",
        },
        {
          id: "l6",
          slug: "nextjs-auth",
          title: "Next.js Authentication",
          progress: 0,
          rating: 4.7,
          level: "Intermediate",
          category: "Web Framework",
          instructor: "Anna Nguyen",
          lastViewed: "2026-01-05",
          thumbnailUrl: "/images/course/image_13.png",
          thumbColor: "from-purple-500 to-indigo-400",
        },
      ],
    },
  ];

  const total = mockCourses.length;
  const isLoading = false;
  const courses = mockCourses;

  // Sort logic
  const [sortKey, setSortKey] = useState<string>("recent");
  const sorted = [...courses].sort((a, b) => {
    if (sortKey === "recent") return b.lastViewed.localeCompare(a.lastViewed);
    if (sortKey === "progress") return b.progress - a.progress;
    if (sortKey === "rating") return b.rating - a.rating;
    return 0;
  });
  const filtered = sorted.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
  const selectedQueue = mockQueueLists.find((q) => q.id === selectedQueueId) || null;

  return (
    <section className="space-y-5 md:space-y-6">
      {/* Tabs */}
      <nav className="border-b border-white/10 pb-2">
        <ul className="flex flex-wrap gap-2 md:gap-3 text-sm">
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <li key={tab}>
                <button
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-3.5 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-slate-950 shadow-sm"
                      : "bg-transparent text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {tab}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {activeTab === "All courses" && (
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Keep learning with your courses
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-xl">
              Resume your in-progress courses or pick a new one to stay on track with
              your goals.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs md:text-sm">
            <select
              className="rounded-full border border-white/15 bg-slate-950/80 px-3 py-2 text-slate-200 outline-none"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
            >
              <option value="recent">Sort by: Recently viewed</option>
              <option value="progress">Sort by: Progress</option>
              <option value="rating">Sort by: Highest rated</option>
            </select>
            <input
              placeholder="Search in my courses"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-44 md:w-64 rounded-full border border-white/15 bg-slate-950/80 px-3 py-2 text-slate-100 text-xs md:text-sm outline-none placeholder:text-slate-500"
            />
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === "All courses" && (
        <>
          {isLoading ? (
            <div className="rounded-2xl bg-slate-900/40 h-[170px] flex items-center justify-center text-slate-400 text-sm">Loading...</div>
          ) : filtered.length > 0 ? (
            <>
              <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((c) => (
                  <MyCourse key={c.id} course={c} />
                ))}
              </div>
              {/* Pagination */}
              <div className="flex justify-center mt-6 gap-2">
                <button
                  className="px-3 py-1 rounded bg-slate-800 text-white disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="px-2 py-1 text-slate-300">Page {page} / {Math.ceil(total / size) || 1}</span>
                <button
                  className="px-3 py-1 rounded bg-slate-800 text-white disabled:opacity-50"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / size)}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center">
              <p className="text-sm font-medium text-slate-200 mb-2">You haven't enrolled in any courses yet.</p>
              <a
                href="/learner/courses"
                className="inline-flex items-center rounded-full bg-lime-600 px-5 py-2 text-white font-semibold shadow hover:bg-lime-700 transition"
              >
                Explore courses
              </a>
            </div>
          )}
        </>
      )}

      {activeTab === "My lists" && (
        <div>
          {!selectedQueueId ? (
            <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
              {mockQueueLists.map((queue) => (
                <div
                  key={queue.id}
                  className="rounded-xl border border-emerald-400/20 bg-slate-900/60 p-4 flex flex-col gap-2 cursor-pointer hover:bg-emerald-900/10 transition"
                  onClick={() => setSelectedQueueId(queue.id)}
                >
                  <div className="font-bold text-lg text-emerald-300 mb-1">{queue.name}</div>
                  <div className="text-xs text-slate-400 mb-2">Created: {queue.created}</div>
                  <div className="text-xs text-slate-500">{queue.lessons.length} lessons in queue</div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <button
                className="mb-4 px-4 py-2 rounded bg-slate-800 text-white"
                onClick={() => setSelectedQueueId(null)}
              >
                ← Back to My Lists
              </button>
              <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
                {selectedQueue && selectedQueue.lessons.map((lesson) => (
                  <CourseCardMini key={lesson.id} course={lesson} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {activeTab === "Archived" && (
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {archivedCertificates.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} />
          ))}
        </div>
      )}
    </section>
  );
}
