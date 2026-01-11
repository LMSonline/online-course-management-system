
"use client";
import { useState } from "react";
import { MyCourseRow } from "./MyCourseRow";
import { useStudentEnrollmentsWithCourses } from "@/hooks/learner/useStudentEnrollmentsWithCourses";
import { EmptyState } from "@/core/components/teacher/courses/EmptyState";

const TABS = ["All courses", "My lists", "Wishlist", "Archived", "Learning tools"] as const;
type TabKey = typeof TABS[number];

export default function MyCoursesSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("All courses");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const size = 16;
  const { courses, total, isLoading } = useStudentEnrollmentsWithCourses(page, size);


  const filtered =
    activeTab === "All courses"
      ? courses.filter((c) =>
          c.title.toLowerCase().includes(search.toLowerCase())
        )
      : [];

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

      {/* Header của block courses (giống “Learn essential career and life skills”) */}
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
            <select className="rounded-full border border-white/15 bg-slate-950/80 px-3 py-2 text-slate-200 outline-none">
              <option>Sort by: Recently viewed</option>
              <option>Sort by: Progress</option>
              <option>Sort by: Highest rated</option>
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
                  <MyCourseRow key={c.id} course={c} />
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

      {activeTab === "Wishlist" && (
        <EmptyState tabType="all" />
      )}
      {activeTab === "My lists" && (
        <EmptyState tabType="all" />
      )}
      {activeTab === "Archived" && (
        <EmptyState tabType="ARCHIVED" />
      )}
      {activeTab === "Learning tools" && (
        <EmptyState tabType="all" />
      )}
    </section>
  );
}
