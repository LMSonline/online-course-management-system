import AdminNavbar from "@/core/components/admin/navbar/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AdminNavbar />
            <main className="min-h-[72vh]">{children}</main>
        </>
    );
}
