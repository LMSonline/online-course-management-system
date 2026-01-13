// src/components/learner/dashboard/ContinueCourseCard.tsx

import { Play } from "lucide-react";
import type { CourseProgress } from "@/lib/learner/progress/progress";


export type ContinueCourseCardProps = {
    course: {
        id: string;
        title: string;
        slug: string;
        progress: number;
    };
};

export function ContinueCourseCard({ course }: ContinueCourseCardProps) {
    const href = `/learner/courses/${course.slug}`;
    const percent = Math.min(100, Math.round(course.progress));

    return (
        <div className="relative overflow-hidden rounded-2xl border border-[var(--brand-600)]/40 bg-gradient-to-br from-[var(--brand-600)]/20 via-slate-950 to-slate-950 px-4 py-4 md:px-5 md:py-5">
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-[var(--brand-900)]/40 blur-2xl" />
            <div className="relative flex flex-col gap-3">
                <p className="text-xs uppercase tracking-wide text-[var(--brand-200)]">
                    Continue learning
                </p>
                <p className="text-sm font-semibold leading-snug">
                    {course.title}
                </p>
                <p className="text-xs text-[var(--brand-50)]/90">
                    Pick up where you left off last time.
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 flex-1 rounded-full bg-black/30 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-lime-300"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                    <span className="text-[11px] text-lime-200">{percent}%</span>
                </div>
                <a
                    href={href}
                    className="mt-2 inline-flex items-center justify-center rounded-xl bg-[var(--brand-600)] text-xs font-medium text-white px-3 py-2 hover:bg-[var(--brand-900)] transition"
                >
                    <Play className="w-3.5 h-3.5 mr-1" />
                    Resume course
                </a>
            </div>
        </div>
    );
}
