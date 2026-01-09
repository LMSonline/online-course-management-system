import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/core/hooks/useCart";
import { courseService } from "@/services/courses/course.service";
import { courseVersionService } from "@/services/courses/courseVersion.service";

interface CartPreviewCourse {
  id: string;
  title: string;
  thumbnailUrl?: string;
  price?: number;
}

export function CartPreviewDropdown({ onClose }: { onClose?: () => void }) {
  const { getRecentCart } = useCart();
  const [courses, setCourses] = useState<CartPreviewCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchCourses() {
      setLoading(true);
      const cartItems = getRecentCart();
      const promises = cartItems.map(async (item) => {
        try {
          const data = await courseService.getCourseBySlug(item.slug);
          // Lấy version mới nhất để lấy price
          let price: number | undefined = undefined;
          try {
            const versions = await courseVersionService.getCourseVersions(data.id);
            if (versions && versions.length > 0) {
              // Lấy version có id lớn nhất (mới nhất)
              const latest = versions.reduce((a, b) => (a.id > b.id ? a : b));
              price = latest.price;
            }
          } catch {}
          return {
            id: String(data.id),
            title: data.title,
            thumbnailUrl: data.thumbnailUrl || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
            price,
          };
        } catch {
          return null;
        }
      });
      const results = (await Promise.all(promises)).filter(Boolean) as CartPreviewCourse[];
      if (mounted) setCourses(results);
      setLoading(false);
    }
    fetchCourses();
    const handler = () => fetchCourses();
    window.addEventListener("cart-updated", handler);
    return () => {
      mounted = false;
      window.removeEventListener("cart-updated", handler);
    };
  }, [getRecentCart]);

  return (
    <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-white/10 bg-slate-900 shadow-xl p-3">
      <div className="font-semibold text-base mb-2 text-white">Cart Preview</div>
      {loading ? (
        <div className="py-8 text-center text-slate-400 text-sm">Loading...</div>
      ) : courses.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm">No courses in cart.</div>
      ) : (
        <ul className="divide-y divide-white/10">
          {courses.map((c) => (
            <li key={c.id} className="flex items-center gap-3 py-2">
              <Image src={c.thumbnailUrl!} alt={c.title} width={48} height={48} className="rounded-lg object-cover bg-slate-800" />
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium text-white text-sm">{c.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">${c.price?.toFixed(2) ?? "0.00"}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="pt-3 mt-2 border-t border-white/10 text-center">
        <Link href="/cart" className="inline-block px-4 py-2 rounded-lg bg-[var(--brand-600)] text-white font-semibold hover:bg-[var(--brand-900)] transition">
          View all cart
        </Link>
      </div>
    </div>
  );
}
