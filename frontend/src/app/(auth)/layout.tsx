"use client";

import { GuestGuard } from "@/core/components/guards";

/**
 * PublicMinimalLayout (auth pages) - guestOnly guard
 * Used for: /login, /register, /forgot-password, /reset-password
 * Minimal header, no search/categories to avoid distraction during auth flow
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <div className="min-h-screen">
        <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <a href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            ← Back to Home
          </a>
        </div>
        <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
          {children}
        </main>
      </div>
    </GuestGuard>
  );
}
