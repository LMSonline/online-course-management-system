"use client";

import React, { useEffect, useState } from "react";
import * as Select from "@radix-ui/react-select";
import { Search, ArrowUpDown, ChevronDown, Check } from "lucide-react";

import type { MyCourse } from "@/lib/learner/dashboard/types";
import { MyCourseRow } from "./MyCourseRow";
import { CertificateCard } from "./CertificateCard";
import { useAuthStore } from "@/lib/auth/authStore";
import { useStudentCertificates } from "@/hooks/student/useStudentCertificates";
import type { StudentCertificateResponse } from "@/services/student/student.service";


const TABS = [
  "All courses",
  "My lists",
  "Wishlist",
  "Archived",
  "Learning tools",
] as const;

type TabKey = (typeof TABS)[number];

/* =======================
   Empty State
======================= */

function EmptyState({ label }: { label: string }) {
  return (
    <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-slate-950/60 px-6 py-12 text-center">
      <p className="text-sm font-medium text-slate-200">{label}</p>
      <p className="mt-2 text-xs text-slate-400">
        Browse the catalog and add courses to see them here.
      </p>
    </div>
  );
}

/* =======================
   Component
======================= */

export function MyCoursesSection({ courses }: { courses: MyCourse[] }) {
  const { studentId } = useAuthStore();
  const [archivedPage, setArchivedPage] = useState(1);
  const CERTS_PER_PAGE = 12;
  const {
    data: certDataRaw,
    isLoading: certLoading,
    error: certError,
  } = useStudentCertificates(studentId ?? 0, archivedPage - 1, CERTS_PER_PAGE);
  // Defensive: fallback if API returns undefined or wrong structure
  const certData: {
    items: StudentCertificateResponse[];
    totalPages: number;
    totalItems: number;
    page: number;
    size: number;
  } = certDataRaw && typeof certDataRaw === 'object' && Array.isArray((certDataRaw as any).items)
    ? certDataRaw as any
    : { items: [], totalPages: 1, totalItems: 0, page: 0, size: CERTS_PER_PAGE };
  const [activeTab, setActiveTab] = useState<TabKey>("All courses");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("recent");

  const COURSES_PER_PAGE = 12;

  /* =======================
     Filter
  ======================= */

  let filtered =
    activeTab === "All courses"
      ? courses.filter((c) =>
          c.title.toLowerCase().includes(search.toLowerCase())
        )
      : [];

  /* =======================
     Sort (GIỮ NGUYÊN LOGIC)
  ======================= */

  if (sort === "recent") {
    filtered = filtered.slice().sort((a, b) => {
      const aTime =
        a.lastViewed && a.lastViewed !== "Unknown"
          ? new Date(a.lastViewed).getTime()
          : 0;
      const bTime =
        b.lastViewed && b.lastViewed !== "Unknown"
          ? new Date(b.lastViewed).getTime()
          : 0;
      return bTime - aTime;
    });
  } else if (sort === "progress") {
    filtered = filtered.slice().sort((a, b) => b.progress - a.progress);
  } else if (sort === "rating") {
    filtered = filtered.slice().sort((a, b) => b.rating - a.rating);
  }

  const totalPages = Math.ceil(filtered.length / COURSES_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * COURSES_PER_PAGE,
    page * COURSES_PER_PAGE
  );

  /* =======================
     Reset page when needed
  ======================= */

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [search, activeTab, totalPages, sort]);

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

      {/* Header */}
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

          {/* ===== SORT + SEARCH (CUSTOM SELECT) ===== */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sort */}
            <Select.Root value={sort} onValueChange={setSort}>
              <Select.Trigger
                className="
                  inline-flex items-center gap-2
                  rounded-full
                  border border-white/15
                  bg-slate-950/70
                  px-3 py-2
                  text-xs md:text-sm
                  text-slate-200
                  hover:border-white/25
                  transition
                "
              >
                <ArrowUpDown className="h-4 w-4 text-slate-400" />
                <Select.Value />
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </Select.Trigger>

              <Select.Portal>
                <Select.Content
                  className="
                    z-50
                    min-w-[180px]
                    overflow-hidden
                    rounded-xl
                    border border-white/10
                    bg-slate-900/95
                    shadow-xl
                    backdrop-blur
                  "
                >
                  <Select.Viewport className="p-1">
                    {[
                      { value: "recent", label: "Recently viewed" },
                      { value: "progress", label: "Progress" },
                      { value: "rating", label: "Highest rated" },
                    ].map((item) => (
                      <Select.Item
                        key={item.value}
                        value={item.value}
                        className="
                          flex items-center justify-between
                          rounded-lg px-3 py-2
                          text-sm text-slate-200
                          cursor-pointer
                          outline-none
                          data-[highlighted]:bg-white/10
                        "
                      >
                        <Select.ItemText>{item.label}</Select.ItemText>
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4 text-emerald-400" />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>

            {/* Search */}
            <div
              className="
                flex items-center gap-2
                rounded-full
                border border-white/15
                bg-slate-950/70
                px-3 py-2
                hover:border-white/25
                transition
              "
            >
              <Search className="h-4 w-4 text-slate-400" />
              <input
                placeholder="Search courses"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-36 md:w-52
                  bg-transparent
                  text-xs md:text-sm
                  text-slate-100
                  outline-none
                  placeholder:text-slate-500
                "
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === "All courses" && (
        <>
          {filtered.length > 0 ? (
            <>
              <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
                {paginated.map((c) => (
                  <MyCourseRow key={c.id} course={c} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    className="px-3 py-1 rounded bg-slate-800 text-slate-200 disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <span className="mx-2 text-sm text-slate-300">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="px-3 py-1 rounded bg-slate-800 text-slate-200 disabled:opacity-50"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState label="No courses match your search." />
          )}
        </>
      )}

      {activeTab === "Wishlist" && (
        <EmptyState label="Your wishlist is empty." />
      )}
      {activeTab === "My lists" && (
        <EmptyState label="You haven't created any custom lists yet." />
      )}
      {activeTab === "Archived" && (
        certLoading ? (
          <EmptyState label="Loading certificates..." />
        ) : certError ? (
          <EmptyState label="Error loading certificates." />
        ) : certData && certData.items && certData.items.length > 0 ? (
          <>
            <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
              {certData.items.map((cert) => (
                <CertificateCard key={cert.certificateId} cert={cert} />
              ))}
            </div>
            {certData.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  className="px-3 py-1 rounded bg-slate-800 text-slate-200 disabled:opacity-50"
                  onClick={() => setArchivedPage((p) => Math.max(1, p - 1))}
                  disabled={archivedPage === 1}
                >
                  Previous
                </button>
                <span className="mx-2 text-sm text-slate-300">
                  Page {archivedPage} of {certData.totalPages}
                </span>
                <button
                  className="px-3 py-1 rounded bg-slate-800 text-slate-200 disabled:opacity-50"
                  onClick={() => setArchivedPage((p) => Math.min(certData.totalPages, p + 1))}
                  disabled={archivedPage === certData.totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState label="No certificates have been achieved yet." />
        )
      )}
      {activeTab === "Learning tools" && (
        <EmptyState label="Learning tools will appear here soon." />
      )}
    </section>
  );
}
