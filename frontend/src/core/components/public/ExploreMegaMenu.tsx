"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useCategoriesTree } from "@/features/categories/hooks/useCategoriesTree";
import type { CategoryResponseDto } from "@/features/categories/types/categories.types";
import { cn } from "@/lib/cn";
import { SafeImage } from "@/components/shared/SafeImage";
import { Skeleton } from "@/components/ui/Skeleton";

interface ExploreMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExploreMegaMenu({ isOpen, onClose }: ExploreMegaMenuProps) {
  const pathname = usePathname();
  const { categories, loading } = useCategoriesTree();
  const [activeCategory, setActiveCategory] = useState<CategoryResponseDto | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when route changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Set first category as active when categories load
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute left-0 top-full mt-2 z-50 w-[720px] max-w-[90vw] rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      <div className="flex h-[500px] max-h-[80vh]">
        {/* Left Column: Top-level categories */}
        <div className="w-1/3 border-r border-white/10 bg-slate-900/50 overflow-y-auto">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-sm font-semibold text-slate-200">Explore by Goal</h3>
          </div>
          {loading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <nav className="p-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-sm transition",
                    "hover:bg-slate-800/60",
                    activeCategory?.id === category.id
                      ? "bg-[var(--brand-600)]/20 text-[var(--brand-300)] font-medium"
                      : "text-slate-300"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Right Column: Subcategories */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : activeCategory ? (
            <>
              <div className="mb-4">
                <h4 className="text-base font-semibold text-slate-100 mb-1">{activeCategory.name}</h4>
                {activeCategory.description && (
                  <p className="text-xs text-slate-400">{activeCategory.description}</p>
                )}
              </div>

              {activeCategory.children.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {activeCategory.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/topic/${child.slug}`}
                      onClick={() => onClose()}
                      className="group flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:border-[var(--brand-500)]/30 hover:bg-slate-800/40 transition"
                    >
                      {child.thumbnailUrl ? (
                        <SafeImage
                          src={child.thumbnailUrl}
                          alt={child.name}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--brand-600)] to-[var(--brand-900)] flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 group-hover:text-[var(--brand-300)] transition">
                          {child.name}
                        </p>
                        {child.description && (
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{child.description}</p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[var(--brand-400)] transition flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No subcategories available
                </div>
              )}

              {/* Show parent category as clickable option if it has children */}
              {activeCategory.children.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Link
                    href={`/topic/${activeCategory.slug}`}
                    onClick={() => onClose()}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-400)] hover:text-[var(--brand-300)] transition"
                  >
                    View all {activeCategory.name} courses
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">Select a category</div>
          )}
        </div>
      </div>
    </div>
  );
}

