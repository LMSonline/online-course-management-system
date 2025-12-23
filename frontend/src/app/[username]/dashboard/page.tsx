"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useAuth";
import { tokenStorage } from "@/lib/api/tokenStorage";

import LearnerDashboardPage from "@/app/learner/dashboard/page";
import TeacherDashboardPage from "@/app/teacher/dashboard/page";
import AdminDashboardPage from "@/app/admin/dashboard/page";

export default function UnifiedDashboard() {
  const router = useRouter();
  const params = useParams();

  const rawUsername = params.username;
  const usernameFromUrl = Array.isArray(rawUsername) ? rawUsername[0] : (rawUsername as string);

  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    // Check authentication
    if (!tokenStorage.getAccessToken()) {
      router.replace("/login");
      return;
    }

    // Handle error
    if (isError) {
      router.replace("/login");
      return;
    }

    // Validate username match
    if (user && user.username !== usernameFromUrl) {
      router.replace(`/${user.username}/dashboard`);
    }
  }, [user, isError, router, usernameFromUrl]);

  if (isLoading) {
    return <p className="text-white p-6">Loading dashboard...</p>;
  }

  if (!user) {
    return null;
  }

  switch (user.role) {
    case "STUDENT":
      return <LearnerDashboardPage />;
    case "TEACHER":
      return <TeacherDashboardPage />;
    case "ADMIN":
      return <AdminDashboardPage />;
    default:
      return (
        <p className="text-red-500 p-6">
          Unknown role: {user.role}
        </p>
      );
  }
}
