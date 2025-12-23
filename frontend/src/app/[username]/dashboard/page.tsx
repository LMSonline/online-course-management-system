"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCurrentUserInfo, type MeUser } from "@/features/auth/services/auth.service";
import { getCurrentTeacher } from "@/features/instructor/services/instructor.service";

import LearnerDashboardPage from "@/app/learner/dashboard/page";
import InstructorDashboardPage from "@/app/instructor/dashboard/page";
import AdminDashboardPage from "@/app/admin/dashboard/page";

export default function UnifiedDashboard() {
  const router = useRouter();
  const params = useParams();

  const rawUsername = params.username;
  const usernameFromUrl =
    Array.isArray(rawUsername) ? rawUsername[0] : (rawUsername as string);

  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        if (typeof window !== "undefined") {
          const cached = localStorage.getItem("user");
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (!cancelled) setUser(parsed);
            } catch {

            }
          }
        }

        const me = await getCurrentUserInfo();

        if (cancelled) return;

        setUser(me);

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(me));
        }

        // If user is a TEACHER, fetch teacher profile to get teacherId if not already stored
        if (me.role === "TEACHER") {
          const storedTeacherId = localStorage.getItem("teacherId");
          if (!storedTeacherId) {
            try {
              const teacherProfile = await getCurrentTeacher();
              localStorage.setItem("teacherId", teacherProfile.id.toString());
            } catch (err) {
              console.warn("Failed to fetch teacher profile:", err);
            }
          }
        } else {
          // Clear teacherId for non-teachers
          if (typeof window !== "undefined") {
            localStorage.removeItem("teacherId");
          }
        }

        if (me.username !== usernameFromUrl) {
          router.replace(`/${me.username}/dashboard`);
          return;
        }
      } catch (err: unknown) {
        if (cancelled) return;
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
        router.replace("/login");
        return;
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [router, usernameFromUrl]);

  if (loading) {
    return <p className="text-white p-6">Loading dashboard...</p>;
  }

  if (!user) {
    return null;
  }

  switch (user.role) {
    case "STUDENT":
      return <LearnerDashboardPage />;
    case "TEACHER":
      return <InstructorDashboardPage />;
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
