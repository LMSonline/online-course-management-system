"use client";

import { AdminGuard } from "@/core/components/guards";
import AdminNavbar from "@/core/components/admin/navbar/AdminNavbar";

/**
 * AdminLayout - requireAdmin guard
 * Used for admin routes: /admin, /admin/users, /admin/audit-logs, etc.
 * Requires: role === "ADMIN"
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <AdminNavbar />
            <main className="min-h-[72vh]">{children}</main>
        </AdminGuard>
    );
}
