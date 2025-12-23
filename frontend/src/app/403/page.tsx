"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold text-slate-50">403</h1>
        <h2 className="text-2xl font-semibold text-slate-200">Access Forbidden</h2>
        <p className="text-slate-400">
          You don't have permission to access this page. This area is restricted to specific user roles.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)] transition"
          >
            Go Home
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl border border-white/10 text-slate-200 hover:bg-white/5 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}

