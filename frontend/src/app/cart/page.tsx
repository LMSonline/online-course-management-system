"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Heart, X } from "lucide-react";
import { useCart } from "@/features/cart/hooks/useCart";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SafeImage } from "@/components/shared/SafeImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToastStore } from "@/lib/toast";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, total, discount, couponCode, removeItem, removeCoupon, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [couponInput, setCouponInput] = useState("");

  useEffect(() => {
    // Simulate hydration delay
    setLoading(false);
  }, []);

  const handleProceedToCheckout = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent("/cart")}`);
      return;
    }

    // Navigate to checkout (placeholder if backend not ready)
    router.push("/checkout");
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      useToastStore.getState().error("Please enter a coupon code");
      return;
    }

    // Mock coupon validation (10% discount)
    // In real implementation, call backend API
    const mockDiscount = subtotal * 0.1;
    useCart().updateCoupon(couponInput.trim(), mockDiscount);
    useToastStore.getState().success("Coupon applied!");
    setCouponInput("");
  };

  const handleRemoveItem = (courseId: string) => {
    removeItem(courseId);
    useToastStore.getState().info("Removed from cart");
  };

  if (loading) {
    return (
      <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
        <section className="mx-auto w-full max-w-6xl xl:max-w-7xl space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
        <section className="mx-auto w-full max-w-6xl xl:max-w-7xl">
          <EmptyState
            title="Your cart is empty"
            message="Start adding courses to your cart to continue learning!"
            action={
              <Link
                href="/explore"
                className="px-6 py-3 rounded-xl bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)] transition inline-block"
              >
                Browse courses
              </Link>
            }
          />
        </section>
      </main>
    );
  }

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-6xl xl:max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left: Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.courseId}
                className="flex gap-4 p-4 rounded-xl border border-white/10 bg-slate-950/80"
              >
                {/* Thumbnail */}
                <Link href={`/learner/courses/${item.courseId}`} className="flex-shrink-0">
                  {item.imageUrl ? (
                    <SafeImage
                      src={item.imageUrl}
                      alt={item.title}
                      width={120}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className={`w-[120px] h-[80px] rounded-lg bg-gradient-to-br ${item.thumbColor || "from-blue-500 to-purple-600"}`} />
                  )}
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link href={`/learner/courses/${item.courseId}`}>
                    <h3 className="text-base font-semibold text-slate-100 hover:text-[var(--brand-300)] transition line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="mt-1 text-sm text-slate-400">{item.instructorName}</p>

                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                    <span>{item.rating.toFixed(1)} ⭐</span>
                    <span>•</span>
                    <span>{item.ratingCount.toLocaleString()} ratings</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-50">{item.priceLabel}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRemoveItem(item.courseId)}
                        className="p-2 rounded-lg hover:bg-slate-800/60 transition"
                        aria-label="Remove from cart"
                      >
                        <Trash2 size={16} className="text-slate-400 hover:text-red-400" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-slate-800/60 transition"
                        aria-label="Move to wishlist"
                      >
                        <Heart size={16} className="text-slate-400 hover:text-pink-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Summary */}
          <div className="md:col-span-1">
            <div className="sticky top-4 p-6 rounded-xl border border-white/10 bg-slate-950/80 space-y-4">
              <h2 className="text-xl font-bold">Summary</h2>

              {/* Coupon */}
              {couponCode ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60">
                  <div>
                    <p className="text-xs text-slate-400">Coupon</p>
                    <p className="text-sm font-medium text-[var(--brand-300)]">{couponCode}</p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 rounded hover:bg-slate-800/60 transition"
                    aria-label="Remove coupon"
                  >
                    <X size={14} className="text-slate-400" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[var(--brand-500)]"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-sm font-medium transition"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount && discount > 0 && (
                  <div className="flex justify-between text-sm text-[var(--brand-300)]">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Proceed button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full px-6 py-3 rounded-xl bg-[var(--brand-600)] text-white font-semibold hover:bg-[var(--brand-700)] transition"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-center text-slate-400">
                {user ? "Ready to checkout" : "Sign in to continue"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

