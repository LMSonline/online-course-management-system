"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import LearnerNavbar from "@/core/components/learner/navbar/LearnerNavbar";
import InstructorNavbar from "@/core/components/instructor/navbar/InstructorNavbar";
import AdminNavbar from "@/core/components/admin/navbar/AdminNavbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const { user, role, loading, fetchMe } = useAuth();

  const rawUsername = params.username;
  const usernameFromUrl = Array.isArray(rawUsername) ? rawUsername[0] : rawUsername;

  useEffect(() => {
    async function verifyUser() {
      if (!user && !loading) {
        try {
          await fetchMe();
        } catch {
          router.replace("/login");
          return;
        }
      }

      if (user) {
        const urlUser = usernameFromUrl?.toLowerCase().trim();
        const realUser = user.username?.toLowerCase().trim();

        if (urlUser !== realUser) {
          router.replace(`/${user.username}/dashboard`);
        }
      }
    }

    verifyUser();
  }, [user, loading, usernameFromUrl, router, fetchMe]);

  if (loading || !user) {
    return <div className="text-center text-white p-6">Loading...</div>;
  }

  return (
    <>
      {role === "STUDENT" && <LearnerNavbar />}
      {role === "TEACHER" && <InstructorNavbar />}
      {role === "ADMIN" && <AdminNavbar />}

      <main className="min-h-[72vh]">{children}</main>
    </>
  );
}
