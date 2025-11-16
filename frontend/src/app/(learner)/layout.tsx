// src/app/(learner)/layout.tsx
import type { ReactNode } from "react";
import LearnerNavbar from "@/core/components/learner/navbar/LearnerNavbar";

export default function LearnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <LearnerNavbar />
      <main className="flex-1">{children}</main>
      {/* Nếu muốn footer riêng cho learner thì thêm ở đây */}
    </div>
  );
}
