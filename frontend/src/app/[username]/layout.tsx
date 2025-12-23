"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useAuth";
import { tokenStorage } from "@/lib/api/tokenStorage";

import LearnerNavbar from "@/core/components/learner/navbar/LearnerNavbar";
import TeacherNavbar from "@/core/components/teacher/navbar/TeacherNavbar";
import AdminNavbar from "@/core/components/admin/navbar/AdminNavbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();

  const rawUsername = params.username;
  const usernameFromUrl = Array.isArray(rawUsername) ? rawUsername[0] : rawUsername;

  const [role, setRole] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!tokenStorage.getAccessToken()) {
      router.replace("/login");
      return;
    }

    // If error loading user, redirect to login
    if (isError) {
      router.replace("/login");
      return;
    }

    // If user loaded successfully
    if (user) {
      const urlUser = usernameFromUrl?.toLowerCase().trim();
      const realUser = user.username?.toLowerCase().trim();

      // If URL has wrong username, redirect to correct one
      if (urlUser !== realUser) {
        router.replace(`/${user.username}/dashboard`);
        return;
      }

      setRole(user.role);
      setVerified(true);
    }
  }, [user, isError, isLoading, router, usernameFromUrl]);

  // Show loading while checking authentication
  if (isLoading || !verified) {
    return <div className="text-center text-white p-6">Loading...</div>;
  }

  return (
    <>
      {role === "STUDENT" && <LearnerNavbar />}
      {role === "TEACHER" && <TeacherNavbar />}
      {role === "ADMIN" && <AdminNavbar />}

      <main className="min-h-[72vh]">{children}</main>
    </>
  );
}
