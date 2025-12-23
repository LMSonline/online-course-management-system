"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useCart } from "@/features/cart/hooks/useCart";
import { clearCart } from "@/features/cart/services/cart.service";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    const paymentIdParam = searchParams.get("paymentId");

    if (orderIdParam && paymentIdParam) {
      setOrderId(orderIdParam);
      setPaymentId(paymentIdParam);
      // Clear cart after successful payment
      clearCart();
    } else {
      // Redirect to cart if no order ID
      router.push("/cart");
    }

    setLoading(false);
  }, [searchParams, router]);

  if (loading) {
    return (
      <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
        <section className="mx-auto w-full max-w-2xl">
          <Skeleton className="h-64 w-full rounded-xl" />
        </section>
      </main>
    );
  }

  if (!orderId) {
    return null; // Redirecting
  }

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-2xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-[var(--brand-600)]/20 p-4">
            <CheckCircle size={64} className="text-[var(--brand-400)]" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-slate-300 mb-2">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <p className="text-sm text-slate-400 mb-8">
          Order ID: <span className="font-mono text-slate-300">{orderId}</span>
        </p>

        <div className="p-6 rounded-xl border border-white/10 bg-slate-950/80 mb-6">
          <h2 className="text-lg font-semibold mb-4">What's next?</h2>
          <ul className="text-left space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-[var(--brand-400)] mt-0.5 flex-shrink-0" />
              <span>You'll receive a confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-[var(--brand-400)] mt-0.5 flex-shrink-0" />
              <span>Access your courses from "My Learning"</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-[var(--brand-400)] mt-0.5 flex-shrink-0" />
              <span>Start learning right away!</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/learner/courses"
            className="px-6 py-3 rounded-xl bg-[var(--brand-600)] text-white font-semibold hover:bg-[var(--brand-700)] transition inline-flex items-center justify-center gap-2"
          >
            Go to My Learning
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/explore"
            className="px-6 py-3 rounded-xl border border-white/20 bg-slate-900/60 text-slate-200 font-semibold hover:bg-slate-800/60 transition"
          >
            Browse More Courses
          </Link>
        </div>
      </section>
    </main>
  );
}

