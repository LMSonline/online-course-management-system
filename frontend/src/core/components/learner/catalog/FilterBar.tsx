// src/components/learner/catalog/FilterBar.tsx
"use client";

type Props = {
  total: number;
  search: string;
  onSearchChange: (v: string) => void;
  sortBy: string;
  onSortByChange: (v: string) => void;
  level: string;
  onLevelChange: (v: string) => void;
  rating: string;
  onRatingChange: (v: string) => void;
};

export function FilterBar({
  total,
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
  level,
  onLevelChange,
  rating,
  onRatingChange,
}: Props) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-100">
          {total} results
        </p>
        <p className="text-xs text-slate-400">
          Use filters to narrow down courses by level and rating.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs md:text-sm">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search within this category"
          className="w-44 md:w-64 rounded-full border border-white/15 bg-slate-950/80 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500"
        />

        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="rounded-full border border-white/15 bg-slate-950/80 px-3 py-2 text-slate-200 outline-none"
        >
          <option value="popular">Sort by: Most popular</option>
          <option value="rating">Sort by: Highest rated</option>
          <option value="newest">Sort by: Newest</option>
        </select>

        <select
          value={level}
          onChange={(e) => onLevelChange(e.target.value)}
          className="rounded-full border border-white/15 bg-slate-950/80 px-3 py-2 text-slate-200 outline-none"
        >
          <option value="all">All levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select
          value={rating}
          onChange={(e) => onRatingChange(e.target.value)}
          className="rounded-full border border-white/15 bg-slate-950/80 px-3 py-2 text-slate-200 outline-none"
        >
          <option value="all">Any rating</option>
          <option value="4.5">4.5 & up</option>
          <option value="4.0">4.0 & up</option>
        </select>
      </div>
    </div>
  );
}
