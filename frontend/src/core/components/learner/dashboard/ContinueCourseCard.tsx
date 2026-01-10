// src/components/learner/dashboard/ContinueCourseCard.tsx
import { Play } from "lucide-react";
import Link from "next/link";

import { useStudentEnrollments } from "@/hooks/enrollment/useStudentEnrollments";
import { useAuthStore } from "@/lib/auth/authStore";
import type { EnrollmentResponse } from "@/services/enrollment/enrollment.service";

export function ContinueCourseCard() {
    const { studentId } = useAuthStore();
    const { data, isLoading } = useStudentEnrollments({ studentId, page: 0, size: 10 });
    const enrollments = (data?.items as EnrollmentResponse[]) || [];
    const latest = enrollments
        .filter((e: EnrollmentResponse) => e.status === "ENROLLED")
        .sort((a: EnrollmentResponse, b: EnrollmentResponse) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime())[0];

    if (isLoading) {
        return (
            <div className="relative overflow-hidden rounded-2xl border border-[var(--brand-600)]/40 bg-gradient-to-br from-[var(--brand-600)]/20 via-slate-950 to-slate-950 px-4 py-4 md:px-5 md:py-5 min-h-[120px] animate-pulse" />
        );
    }
    if (!latest) {
        return (
            <Link href="/courses" className="relative overflow-hidden rounded-2xl border border-[var(--brand-600)]/40 bg-gradient-to-br from-[var(--brand-600)]/20 via-slate-950 to-slate-950 px-4 py-4 md:px-5 md:py-5 block">
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-[var(--brand-900)]/40 blur-2xl" />
                <div className="relative flex flex-col gap-3 items-center justify-center min-h-[100px]">
                    <p className="text-xs uppercase tracking-wide text-[var(--brand-200)]">No active course</p>
                    <span className="text-sm font-semibold text-center text-[var(--brand-50)]/90">You haven't started any course yet.</span>
                    <span className="mt-3 inline-flex items-center justify-center rounded-xl bg-[var(--brand-600)] text-xs font-medium text-white px-4 py-2 hover:bg-[var(--brand-900)] transition w-max">
                        Explore courses
                    </span>
                </div>
            </Link>
        );
    }
    const percent = Math.round(latest.completionPercentage);
    return (
        <Link href={`/learn/${latest.courseId}`} className="relative overflow-hidden rounded-2xl border border-[var(--brand-600)]/40 bg-gradient-to-br from-[var(--brand-600)]/20 via-slate-950 to-slate-950 px-4 py-4 md:px-5 md:py-5 block">
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-[var(--brand-900)]/40 blur-2xl" />
            <div className="relative flex flex-col gap-3">
                <p className="text-xs uppercase tracking-wide text-[var(--brand-200)]">Continue learning</p>
                <p className="text-sm font-semibold leading-snug line-clamp-2">{latest.courseTitle}</p>
                <p className="text-xs text-[var(--brand-50)]/90">Pick up where you left off last time.</p>
                <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 flex-1 rounded-full bg-black/30 overflow-hidden">
                        <div className="h-full" style={{ width: `${percent}%`, background: "linear-gradient(90deg,#bef264,#4ade80)" }} />
                    </div>
                    <span className="text-[11px] text-lime-200">{percent}%</span>
                </div>
                <span className="mt-2 inline-flex items-center justify-center rounded-xl bg-[var(--brand-600)] text-xs font-medium text-white px-3 py-2 hover:bg-[var(--brand-900)] transition w-max">
                    <Play className="w-3.5 h-3.5 mr-1" /> Resume course
                </span>
            </div>
        </Link>
    );
}
