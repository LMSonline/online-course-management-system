"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Public route error:", error);
    }
  }, [error]);

  return (
    <div className="min-h-[72vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-semibold text-slate-50">Something went wrong</h2>
        <p className="text-slate-400 text-sm">{error.message || "Please try again."}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)] transition text-sm"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl border border-white/10 text-slate-200 hover:bg-white/5 transition text-sm"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

