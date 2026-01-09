"use client";

import { useTags } from "@/hooks/public/useTags";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Tag, AlertCircle } from "lucide-react";

/**
 * TagListScreen
 * Route: /tags
 * Layout: PublicLayout
 * Guard: none
 * 
 * Shows list of tags with search functionality.
 * Clicking a tag navigates to /courses?tag=<slug> or /courses?q=<tag>
 */
export default function TagListScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const page = parseInt(searchParams.get("page") || "0");
  const size = parseInt(searchParams.get("size") || "50");

  const {
    data: tagsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useTags(page, size);

  // Update URL when search changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== searchParams.get("q")) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery) {
          params.set("q", searchQuery);
        } else {
          params.delete("q");
        }
        params.set("page", "0"); // Reset to first page on search
        router.push(`/tags?${params.toString()}`);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchParams, router]);

  // Filter tags client-side if search query exists
  const tags = tagsData?.content || [];
  const filteredTags = searchQuery
    ? tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tag.slug && tag.slug.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : tags;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Tags</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Browse courses by tags
        </p>

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load tags</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error?.message || "An error occurred while loading tags."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-[var(--brand-600)] text-white rounded-xl hover:bg-[var(--brand-900)] transition"
          >
            Retry
          </button>
        </div>
      ) : filteredTags.length === 0 ? (
        <div className="text-center py-12">
          <Tag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {searchQuery ? "No tags found" : "No tags available"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery
              ? "Try a different search term"
              : "Tags will appear here when courses are created"}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-3 mb-8">
            {filteredTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/courses?tag=${tag.slug || tag.name}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/40 border border-white/10 rounded-full hover:border-[var(--brand-600)] hover:bg-slate-800 transition"
              >
                <Tag className="h-4 w-4" />
                <span>{tag.name}</span>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {tagsData && tagsData.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {page > 0 && (
                <Link
                  href={`/tags?page=${page - 1}&size=${size}${searchQuery ? `&q=${searchQuery}` : ""}`}
                  className="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700"
                >
                  Previous
                </Link>
              )}
              {Array.from({ length: tagsData.totalPages }, (_, i) => (
                <Link
                  key={i}
                  href={`/tags?page=${i}&size=${size}${searchQuery ? `&q=${searchQuery}` : ""}`}
                  className={`px-4 py-2 rounded-lg ${
                    i === page
                      ? "bg-[var(--brand-600)] text-white"
                      : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
              {page < tagsData.totalPages - 1 && (
                <Link
                  href={`/tags?page=${page + 1}&size=${size}${searchQuery ? `&q=${searchQuery}` : ""}`}
                  className="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
