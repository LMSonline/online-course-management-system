// src/components/learner/catalog/CatalogHeader.tsx
export function CatalogHeader() {
  return (
    <header className="mb-6 md:mb-8">
      <p className="inline-flex items-center rounded-full border border-[var(--brand-600)]/40 bg-[var(--brand-600)]/10 px-3 py-1 text-[11px] font-medium text-[var(--brand-200)] uppercase tracking-wide">
        Course catalog
      </p>

      <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
        Explore courses for your next skill
      </h1>

      <p className="mt-3 max-w-3xl text-sm md:text-[15px] text-slate-300">
        Browse by topic, filter by level and rating, and find the right course to
        continue your learning journey.
      </p>
    </header>
  );
}
