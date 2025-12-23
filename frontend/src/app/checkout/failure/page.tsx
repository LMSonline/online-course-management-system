"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function CheckoutFailurePage() {
  const router = useRouter();

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-2xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-500/20 p-4">
            <XCircle size={64} className="text-red-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
        <p className="text-slate-300 mb-8">
          We couldn't process your payment. Please check your payment details and try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/checkout"
            className="px-6 py-3 rounded-xl bg-[var(--brand-600)] text-white font-semibold hover:bg-[var(--brand-700)] transition inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Try Again
          </Link>
          <Link
            href="/cart"
            className="px-6 py-3 rounded-xl border border-white/20 bg-slate-900/60 text-slate-200 font-semibold hover:bg-slate-800/60 transition"
          >
            Back to Cart
          </Link>
        </div>
      </section>
    </main>
  );
}

