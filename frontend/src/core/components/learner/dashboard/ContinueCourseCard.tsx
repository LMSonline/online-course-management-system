import { Play } from "lucide-react";
import { useAuthStore } from "@/lib/auth/authStore";
import { useStudentEnrollments } from "@/hooks/enrollment/useStudentEnrollments";
import Link from "next/link";

export function ContinueCourseCard() {
    const { studentId } = useAuthStore();
    const { data, isLoading } = useStudentEnrollments({ studentId, page: 0, size: 20 });
    const enrollments = data?.items || [];

    const inProgress = enrollments
        .filter((e: import("@/services/enrollment/enrollment.service").EnrollmentResponse) => e.completionPercentage < 100 && e.lastAccessed)
        .sort((a: import("@/services/enrollment/enrollment.service").EnrollmentResponse, b: import("@/services/enrollment/enrollment.service").EnrollmentResponse) =>
            new Date(b.lastAccessed!).getTime() - new Date(a.lastAccessed!).getTime()
        );
    const course = inProgress[0];

    if (!course) {
        return (
            <div className="relative overflow-hidden rounded-2xl border border-[var(--brand-600)]/40 bg-gradient-to-br from-[var(--brand-600)]/20 via-slate-950 to-slate-950 px-4 py-4 md:px-5 md:py-5 flex items-center justify-center min-h-[120px]">
                <span className="text-xs text-slate-400">No course in progress</span>
            </div>
        );
    }

    const percent = Math.round(course.completionPercentage ?? 0);
    const href = `/learner/courses/${course.courseId}`;

    return (
        <div className="relative overflow-hidden rounded-2xl border border-[var(--brand-600)]/40 bg-gradient-to-br from-[var(--brand-600)]/20 via-slate-950 to-slate-950 px-4 py-4 md:px-5 md:py-5">
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-[var(--brand-900)]/40 blur-2xl" />
            <div className="relative flex flex-col gap-3">
                <p className="text-xs uppercase tracking-wide text-[var(--brand-200)]">Continue learning</p>
                <p className="text-sm font-semibold leading-snug">{course.courseTitle}</p>
                <p className="text-xs text-[var(--brand-50)]/90">Pick up where you left off last time.</p>
                <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 flex-1 rounded-full bg-black/30 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${percent}%`, background: "linear-gradient(90deg,#bef264,#4ade80)" }} />
                    </div>
                    <span className="text-[11px] text-lime-200">{percent}%</span>
                </div>
                <Link href={href} className="mt-2 inline-flex items-center justify-center rounded-xl bg-[var(--brand-600)] text-xs font-medium text-white px-3 py-2 hover:bg-[var(--brand-900)] transition">
                    <Play className="w-3.5 h-3.5 mr-1" />
                    Resume course
                </Link>
            </div>
        </div>
    );
}
