// src/app/(admin)/dashboard/page.tsx
"use client";

import { ADMIN_MOCK_DATA } from "@/lib/admin/types";
import { AdminDashboardHeader } from "@/core/components/admin/dashboard/AdminDashboardHeader";
import { AdminStatsRow } from "@/core/components/admin/dashboard/AdminStatsRow";
import { AdminDashboardCharts } from "@/core/components/admin/dashboard/AdminDashboardCharts";

export default function AdminDashboardPage() {
  const data = ADMIN_MOCK_DATA;

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-6xl xl:max-w-7xl space-y-5 md:space-y-6">
        <AdminDashboardHeader overview={data.overview} />
        <AdminStatsRow overview={data.overview} />
        <AdminDashboardCharts monthly={data.monthly} />
      </section>
    </main>
  );
}
