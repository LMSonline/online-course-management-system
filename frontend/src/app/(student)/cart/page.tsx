"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";

import { useCart } from "@/core/hooks/useCart";
import { courseService } from "@/services/courses/course.service";
import { courseVersionService } from "@/services/courses/courseVersion.service";
import { teacherService } from "@/services/teacher/teacher.service";

export default function StudentCartPage() {
  const { getCart, removeFromCart, clearCart } = useCart();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(getCart());

  // Sync cart state with localStorage changes
  useEffect(() => {
    const handler = () => setCart(getCart());
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, [getCart]);

  useEffect(() => {
    let mounted = true;

    async function fetchCourses() {
      setLoading(true);
      try {
        if (cart.length === 0) {
          if (mounted) setCourses([]);
          setLoading(false);
          return;
        }
        const results = await Promise.all(
          cart.map(async (item) => {
            try {
              const course = await courseService.getCourseBySlug(item.slug);
              let price: number | undefined = undefined;
              let thumbnailUrl = course?.thumbnailUrl || "/images/course-default.png";
              let teacherName = "Instructor";
              if (course?.teacherId) {
                try {
                  const teacher = await teacherService.getById(course.teacherId);
                  teacherName = teacher?.fullName || "Instructor";
                } catch {
                  teacherName = "Instructor";
                }
              }

              if (course?.id) {
                try {
                  const versions = await courseVersionService.getCourseVersions(course.id);
                  if (versions?.length) {
                    const latest = versions.reduce((a, b) =>
                      a.versionNumber > b.versionNumber ? a : b
                    );
                    price = typeof latest.price === 'number' ? latest.price : 0;
                  } else {
                    price = 0;
                  }
                } catch {
                  price = 0;
                }
              } else {
                price = 0;
              }

              return {
                ...course,
                price,
                thumbnailUrl,
                teacherName,
              };
            } catch {
              // fallback dữ liệu mẫu nếu không load được course
              return {
                id: item.courseId,
                slug: item.slug,
                title: "Unknown Course",
                price: 0,
                thumbnailUrl: "/images/course-default.png",
                teacherName: "Instructor",
              };
            }
          })
        );

        if (mounted) setCourses(results);
      } catch {
        if (mounted) setCourses([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
    return () => {
      mounted = false;
    };
  }, [cart]);

  const total = courses.reduce(
    (sum, c) => sum + (typeof c.price === "number" ? c.price : 0),
    0
  );

  return (
    <div className="bg-slate-950 text-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Shopping Cart
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Review your selected courses before checkout
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="
                text-sm
                text-red-400
                hover:text-red-300
                transition
              "
            >
              Clear all
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            Loading your cart...
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-semibold">Your cart is empty</p>
            <p className="mt-2 text-sm text-slate-400">
              Browse courses and add them to your cart.
            </p>
            <Link
              href="/"
              className="
                mt-6
                inline-flex
                rounded-full
                bg-emerald-600
                px-6 py-2.5
                text-sm font-semibold
                text-white
                hover:bg-emerald-700
                transition
              "
            >
              Explore courses
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* LEFT: CART ITEMS */}
            <div className="lg:col-span-8 space-y-4">
              {courses.map((course, idx) => (
                <div
                  key={course.id}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900/80 p-4 hover:border-emerald-400/40 transition items-center"
                >
                  {/* Thumbnail */}
                  <div className="h-20 w-32 flex-shrink-0 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center">
                    <img
                      src={course.thumbnailUrl || "/images/course-default.png"}
                      alt={course.title}
                      className="object-cover w-full h-full"
                      style={{ minHeight: 80, minWidth: 128 }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/course/${course.slug}`}
                      className="font-semibold text-slate-100 hover:underline line-clamp-2 text-base md:text-lg"
                    >
                      {course.title}
                    </Link>

                    <p className="mt-1 text-xs text-slate-400">
                      {course.teacherName || course.teacher?.name || "Instructor"}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-semibold text-emerald-400">
                        {typeof course.price === "number"
                          ? `$${course.price.toFixed(2)}`
                          : "Free"}
                      </span>

                      <button
                        onClick={() => removeFromCart(cart[idx].courseId)}
                        className="inline-flex items-center gap-1 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 px-2 py-1 rounded transition"
                        title="Remove from cart"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: SUMMARY */}
            <aside className="lg:col-span-4">
              <div
                className="
                  sticky top-24
                  rounded-2xl
                  border border-white/10
                  bg-slate-900/80
                  p-5
                  space-y-4
                "
              >
                <h2 className="text-lg font-semibold">Order summary</h2>

                <div className="flex justify-between text-sm text-slate-400">
                  <span>Courses ({courses.length})</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-2xl font-bold text-white">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  className="
                    w-full
                    rounded-xl
                    bg-emerald-600
                    py-3
                    text-sm font-semibold
                    text-white
                    hover:bg-emerald-700
                    transition
                  "
                >
                  Proceed to checkout
                </button>

                <p className="text-xs text-slate-400 text-center">
                  Secure checkout · 30-day money-back guarantee
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
