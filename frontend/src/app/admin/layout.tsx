"use client";

import { AdminGuard } from "@/core/components/guards";
import { AdminSidebar } from "@/core/components/admin/dashboard/AdminSidebar";
import { AdminTopBar } from "@/core/components/admin/dashboard/AdminTopBar";

/**
 * AdminLayout - requireAdmin guard
 * Used for admin routes: /admin, /admin/users, /admin/audit-logs, etc.
 * Requires: role === "ADMIN"
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <div className="flex min-h-screen bg-[#181f36]">
                <AdminSidebar />
                <div className="flex-1 flex flex-col">
                    <AdminTopBar stats={{}} />
                    <main className="min-h-[72vh] flex-1 px-8 py-6">
                        {children}
                    </main>
                </div>
            </div>
        </AdminGuard>
    );
}
