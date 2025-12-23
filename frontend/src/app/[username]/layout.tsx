"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getCurrentUserInfo } from "@/services/auth";

import LearnerNavbar from "@/core/components/learner/navbar/LearnerNavbar";
import InstructorNavbar from "@/core/components/instructor/navbar/InstructorNavbar";
import AdminNavbar from "@/core/components/admin/navbar/AdminNavbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();

  const rawUsername = params.username;
  const usernameFromUrl = Array.isArray(rawUsername) ? rawUsername[0] : rawUsername;

  const [role, setRole] = useState<string | null>(null);
  const [verified, setVerified] = useState(false); // tránh loop

  useEffect(() => {
    async function loadUser() {
      try {
        const me = await getCurrentUserInfo(); // { username, role, ... }

        const urlUser = usernameFromUrl?.toLowerCase().trim();
        const realUser = me.username?.toLowerCase().trim();

        // Nếu URL sai username → redirect sang URL đúng
        if (urlUser !== realUser) {
          router.replace(`/${me.username}/dashboard`);
          return;
        }

        setRole(me.role);
        setVerified(true);
      } catch (err) {
        router.replace("/login");
      }
    }

    loadUser();
  }, [router, usernameFromUrl]);

  // Khi chưa xác thực → tránh hiển thị UI sai
  if (!verified) {
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
