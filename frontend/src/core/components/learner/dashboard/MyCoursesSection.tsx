"use client";
import { useState } from "react";
import { MyCourseRow } from "./MyCourseRow_v1";
import { CertificateCard } from "./CertificateCard";
import { useCourses } from "@/hooks/learner/useCourse";

const TABS = ["All courses", "My lists", "Archived"] as const;
type TabKey = (typeof TABS)[number];

export default function MyCoursesSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("All courses");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string>("recent");

  const size = 12;

  // Fetch courses from API
  const { data, isLoading, isError } = useCourses({
    page,
    size,
    status: "PUBLISHED", // Only show published courses
  });

  const courses = data?.items || [];
  const total = data?.totalItems || 0;
  const totalPages = data?.totalPages || 1;

  // Filter by search
  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  // Sort logic (client-side sorting for now)
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "recent") {
      // Sort by publishedAt or approvedAt
      const dateA = a.publishedAt || a.approvedAt || "";
      const dateB = b.publishedAt || b.approvedAt || "";
      return dateB.localeCompare(dateA);
    }
    if (sortKey === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  // Mock data for My lists (Queue Lists)
  const mockQueueLists = [
    {
      id: "queue-1",
      name: "Frontend Mastery",
      created: "2026-01-05",
      courseCount: 3,
    },
    {
      id: "queue-2",
      name: "Backend Essentials",
      created: "2026-01-03",
      courseCount: 2,
    },
    {
      id: "queue-3",
      name: "Fullstack Path",
      created: "2026-01-01",
      courseCount: 4,
    },
  ];

  // Mock data for Archived (certificates)
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

  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);

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
              Resume your in-progress courses or pick a new one to stay on track
              with your goals.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs md:text-sm">
            <select
              className="rounded-full border border-white/15 bg-slate-950/80 px-3 py-2 text-slate-200 outline-none"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
            >
              <option value="recent">Sort by: Recently published</option>
              <option value="title">Sort by: Title</option>
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

      {/* Course card list */}
      {activeTab === "All courses" && (
        <>
          {isLoading ? (
            <div className="rounded-2xl bg-slate-900/40 h-[170px] flex items-center justify-center text-slate-400 text-sm">
              Loading courses...
            </div>
          ) : isError ? (
            <div className="rounded-2xl bg-slate-900/40 h-[170px] flex items-center justify-center text-red-400 text-sm">
              Failed to load courses. Please try again.
            </div>
          ) : sorted.length > 0 ? (
            <>
              <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
                {sorted.map((course) => (
                  <MyCourseRow key={course.id} course={course} progress={0} />
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  <button
                    className="px-3 py-1 rounded bg-slate-800 text-white disabled:opacity-50 hover:bg-slate-700 transition"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <span className="px-2 py-1 text-slate-300">
                    Page {page} / {totalPages}
                  </span>
                  <button
                    className="px-3 py-1 rounded bg-slate-800 text-white disabled:opacity-50 hover:bg-slate-700 transition"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center py-12">
              <p className="text-sm font-medium text-slate-200 mb-2">
                You haven't enrolled in any courses yet.
              </p>
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
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight mb-4">
                My Learning Lists
              </h2>
              <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
                {mockQueueLists.map((queue) => (
                  <div
                    key={queue.id}
                    className="rounded-xl border border-emerald-400/20 bg-slate-900/60 p-4 flex flex-col gap-2 cursor-pointer hover:bg-emerald-900/10 transition"
                    onClick={() => setSelectedQueueId(queue.id)}
                  >
                    <div className="font-bold text-lg text-emerald-300 mb-1">
                      {queue.name}
                    </div>
                    <div className="text-xs text-slate-400 mb-2">
                      Created: {queue.created}
                    </div>
                    <div className="text-xs text-slate-500">
                      {queue.courseCount} courses in list
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button
                className="mb-4 px-4 py-2 rounded bg-slate-800 text-white hover:bg-slate-700 transition"
                onClick={() => setSelectedQueueId(null)}
              >
                ← Back to My Lists
              </button>
              <div className="text-center text-slate-400 py-12">
                Queue list details coming soon...
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "Archived" && (
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight mb-4">
            Completed Courses & Certificates
          </h2>
          {archivedCertificates.length > 0 ? (
            <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
              {archivedCertificates.map((cert) => (
                <CertificateCard key={cert.id} cert={cert} />
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 py-12">
              No certificates yet. Complete a course to earn your first certificate!
            </div>
          )}
        </div>
      )}
    </section>
  );
}
