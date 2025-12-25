"use client";

import { useAuthStore } from "@/store/auth.store";

export default function DebugAuthPage() {
  const store = useAuthStore();

  return (
    <main className="px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">Auth Debug</h1>
      <pre className="whitespace-pre-wrap break-all rounded-md bg-slate-900/60 p-4 text-xs">
        {JSON.stringify(
          {
            status: store.status,
            loaded: store.loaded,
            isAuthenticated: store.isAuthenticated,
            role: store.role,
            userId: store.userId,
            studentId: store.studentId,
            teacherId: store.teacherId,
            hasAccessToken: Boolean(store.accessToken),
            hasRefreshToken: Boolean(store.refreshToken),
          },
          null,
          2
        )}
      </pre>
    </main>
  );
}


