// src/components/learner/dashboard/MyCoursesSection.tsx
"use client";

import { useState } from "react";
import type { MyCourse } from "@/lib/learner/dashboard/types";
import { MyCourseRow } from "./MyCourseRow";

const TABS = ["All courses", "My lists", "Wishlist", "Archived", "Learning tools"] as const;
type TabKey = (typeof TABS)[number];

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

export function MyCoursesSection({ courses }: { courses: MyCourse[] }) {
  const [activeTab, setActiveTab] = useState<TabKey>("All courses");
  const [search, setSearch] = useState("");

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
          {filtered.length > 0 ? (
            <div className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((c) => (
                <MyCourseRow key={c.id} course={c} />
              ))}
            </div>
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
        <EmptyState label="No courses have been archived." />
      )}
      {activeTab === "Learning tools" && (
        <EmptyState label="Learning tools will appear here soon." />
      )}
    </section>
  );
}
