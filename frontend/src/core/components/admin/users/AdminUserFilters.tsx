"use client";

import { useState } from "react";
import type { AdminUserRole, AdminUserStatus } from "@/lib/admin/types";

type Props = {
  onChange: (opts: {
    role: AdminUserRole | "All";
    status: AdminUserStatus | "All";
    search: string;
  }) => void;
};

export function AdminUserFilters({ onChange }: Props) {
  const [role, setRole] = useState<AdminUserRole | "All">("All");
  const [status, setStatus] = useState<AdminUserStatus | "All">("All");
  const [search, setSearch] = useState("");

  const emit = (
    next: Partial<{
      role: AdminUserRole | "All";
      status: AdminUserStatus | "All";
      search: string;
    }>
  ) => {
    const value = {
      role: next.role ?? role,
      status: next.status ?? status,
      search: next.search ?? search,
    };
    setRole(value.role);
    setStatus(value.status);
    setSearch(value.search);
    onChange(value);
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-3.5 md:p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-50">
          User management
        </h2>
        <p className="text-[11px] text-slate-400">
          Filter by role, status or name/email.
        </p>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <input
          className="flex-1 rounded-full border border-white/15 bg-slate-950 px-3 py-2 text-xs md:text-sm text-slate-50 outline-none focus:border-[var(--brand-500)]"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => emit({ search: e.target.value })}
        />
        <div className="flex gap-2">
          <select
            className="rounded-full border border-white/15 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-[var(--brand-500)]"
            value={role}
            onChange={(e) =>
              emit({ role: e.target.value as AdminUserRole | "All" })
            }
          >
            <option value="All">All roles</option>
            <option value="Learner">Learner</option>
            <option value="Instructor">Instructor</option>
            <option value="Admin">Admin</option>
          </select>
          <select
            className="rounded-full border border-white/15 bg-slate-950 px-3 py-2 text-xs text-slate-50 outline-none focus:border-[var(--brand-500)]"
            value={status}
            onChange={(e) =>
              emit({ status: e.target.value as AdminUserStatus | "All" })
            }
          >
            <option value="All">All status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>
    </section>
  );
}
