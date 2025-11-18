"use client";

import { Shield, MoreHorizontal } from "lucide-react";
import type { AdminUser } from "@/lib/admin/types";

type Props = {
  users: AdminUser[];
};

const statusChip: Record<
  AdminUser["status"],
  string
> = {
  Active: "bg-emerald-500/10 text-emerald-300 border-emerald-500/60",
  Pending: "bg-amber-500/10 text-amber-200 border-amber-500/60",
  Suspended: "bg-rose-500/10 text-rose-200 border-rose-500/60",
};

export function AdminUserTable({ users }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 md:p-5 mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm md:text-base font-semibold text-slate-50">
          Users
        </h2>
        <p className="text-[11px] text-slate-400">
          {users.length} result(s) shown (mock data).
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs md:text-sm">
          <thead className="border-b border-white/10 text-xs text-slate-400">
            <tr>
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Role</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Created</th>
              <th className="py-2 pr-4 font-medium">Last active</th>
              <th className="py-2 pl-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="align-middle">
                <td className="py-3 pr-4">
                  <p className="text-sm font-medium text-slate-100">
                    {u.name}
                  </p>
                  <p className="text-[11px] text-slate-500">{u.email}</p>
                </td>
                <td className="py-3 pr-4 text-slate-100">
                  {u.role === "Admin" && (
                    <Shield className="inline-block w-3.5 h-3.5 mr-1 text-[var(--brand-300)]" />
                  )}
                  {u.role}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${statusChip[u.status]}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {u.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-slate-100">
                  {u.createdAt}
                </td>
                <td className="py-3 pr-4 text-slate-100">
                  {u.lastActive}
                </td>
                <td className="py-3 pl-2 text-right">
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-slate-50 transition">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
