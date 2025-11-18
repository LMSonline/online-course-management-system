"use client";

import { useMemo, useState } from "react";
import {
  ADMIN_MOCK_DATA,
  type AdminUser,
  type AdminUserRole,
  type AdminUserStatus,
} from "@/lib/admin/types";
import { AdminUserFilters } from "@/core/components/admin/users/AdminUserFilters";
import { AdminUserTable } from "@/core/components/admin/users/AdminUserTable";

export default function AdminUserManagementPage() {
  const allUsers = ADMIN_MOCK_DATA.users;
  const [filter, setFilter] = useState<{
    role: AdminUserRole | "All";
    status: AdminUserStatus | "All";
    search: string;
  }>({ role: "All", status: "All", search: "" });

  const filtered: AdminUser[] = useMemo(() => {
    return allUsers.filter((u) => {
      if (filter.role !== "All" && u.role !== filter.role) return false;
      if (filter.status !== "All" && u.status !== filter.status) return false;
      if (filter.search.trim()) {
        const q = filter.search.toLowerCase();
        if (
          !u.name.toLowerCase().includes(q) &&
          !u.email.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [allUsers, filter]);

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-6xl xl:max-w-7xl">
        <AdminUserFilters onChange={setFilter} />
        <AdminUserTable users={filtered} />
      </section>
    </main>
  );
}
