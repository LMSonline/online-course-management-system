"use client";
import CourseHoverCard from "@/core/components/course/CourseHoverCard";
import { previewFromSkillCourse } from "@/core/components/infra/PreviewAdapters";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SkillCourseCard, { type SkillCourse } from "@/core/components/course/SkillCourseCard";

/* ================= Tabs & mock data ================= */
const TABS = [
    "Artificial Intelligence (AI)",
    "Python",
    "Microsoft Excel",
    "AI Agents & Agentic AI",
    "Digital Marketing",
    "Amazon AWS",
] as const;

function makeCourses(prefix: string, n = 12): SkillCourse[] {
    return Array.from({ length: n }).map((_, i) => ({
        id: `${prefix}-${i + 1}`,
        title: `${prefix} Course #${i + 1}`,
        teacher: "John Doe",
        price: "₫199,000",
        rating: 4.4 + ((i % 5) * 0.1),
        image: "/images/lesson_thum.png",
        bestSeller: i % 4 === 0,
    }));
}

const DATA: Record<(typeof TABS)[number], SkillCourse[]> = {
    "Artificial Intelligence (AI)": makeCourses("AI"),
    Python: makeCourses("Python"),
    "Microsoft Excel": makeCourses("Excel"),
    "AI Agents & Agentic AI": makeCourses("AgenticAI"),
    "Digital Marketing": makeCourses("Marketing"),
    "Amazon AWS": makeCourses("AWS"),
};

/* =============== Responsive items-per-view =============== */
function usePerView() {
    const [pv, setPv] = useState(1);
    useEffect(() => {
        if (typeof window === "undefined") return;
        const md = matchMedia("(min-width: 768px)");
        const lg = matchMedia("(min-width: 1024px)");
        const xl = matchMedia("(min-width: 1280px)");
        const compute = () => setPv(xl.matches ? 4 : lg.matches ? 3 : md.matches ? 2 : 1);
        compute();
        const list = [md, lg, xl];
        list.forEach((mq) => mq.addEventListener("change", compute));
        return () => list.forEach((mq) => mq.removeEventListener("change", compute));
    }, []);
    return pv;
}



/* =================== Component =================== */
export default function SkillsTabCarouselSection() {
    const [active, setActive] = useState<(typeof TABS)[number]>(TABS[0]);
    const courses = useMemo(() => DATA[active], [active]);

    const perView = usePerView();
    const [page, setPage] = useState(0);

    useEffect(() => setPage(0), [active, perView]);

    const pages = Math.max(1, Math.ceil(courses.length / perView));
    const maxPage = pages - 1;

    const translatePct = page * (100 / pages);
    const trackWidthPct = pages * 100;
    const itemBasisPct = 100 / (perView * pages);

    const canPrev = page > 0;
    const canNext = page < maxPage;

    const go = (dir: "prev" | "next") =>
        setPage((p) => Math.min(maxPage, Math.max(0, p + (dir === "next" ? 1 : -1))));



    return (
        <section className="w-full mt-6 px-4 sm:px-6 md:px-10 xl:px-16">
            {/* Heading */}
            <div className="mb-5">
                <h2 className="text-[28px] md:text-[36px] font-extrabold leading-tight tracking-tight max-w-[1100px]">
                    Skills to transform your career and life
                </h2>
                <p className="mt-5 text-[15px] md:text-base text-muted-foreground/90 max-w-[900px]">
                    Learn the most in-demand skills from experienced instructors.
                </p>
            </div>

            {/* Tabs (nhẹ, thoáng, có scroll ngang trên mobile) */}
            <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex gap-x-5 gap-y-2 flex-wrap sm:flex-nowrap overflow-x-auto whitespace-nowrap scrollbar-none border-b border-white/5 pb-2">
                    {TABS.map((t) => {
                        const isActive = t === active;
                        return (
                            <button
                                key={t}
                                onClick={() => setActive(t)}
                                className={`relative pb-3 text-sm font-medium transition-colors
                  ${isActive ? "text-white" : "text-muted-foreground hover:text-lime-300"}
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300/40 rounded`}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {t}
                                {isActive && (
                                    <span className="absolute -bottom-[1px] left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-400" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Carousel */}
            <div className="relative mt-6 overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] will-change-transform"
                    style={{
                        width: `${trackWidthPct}%`,
                        transform: `translateX(-${translatePct}%)`,
                        gap: "16px",
                    }}
                >
                    {courses.map((c) => (
                        <div key={c.id} style={{ flex: `0 0 ${itemBasisPct}%` }} className="min-w-0">
                            <CourseHoverCard preview={previewFromSkillCourse(c)} anchorClassName="h-full block">
                                <SkillCourseCard {...c} />
                            </CourseHoverCard>
                        </div>
                    ))}
                </div>

                {/* Arrows */}
                <button
                    type="button"
                    onClick={() => go("prev")}
                    disabled={!canPrev}
                    aria-label="Previous page"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 inline-flex h-12 w-12 items-center justify-center
                     rounded-full bg-white text-[#65D830]
                     shadow-[0_4px_15px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.3)]
                     transition-all duration-300 ease-out
                     hover:shadow-[0_6px_20px_rgba(101,216,48,0.4),0_0_0_1px_rgba(101,216,48,0.3)]
                     hover:scale-[1.05]
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
                </button>

                <button
                    type="button"
                    onClick={() => go("next")}
                    disabled={!canNext}
                    aria-label="Next page"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 inline-flex h-12 w-12 items-center justify-center
                     rounded-full bg-white text-[#65D830]
                     shadow-[0_4px_15px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.3)]
                     transition-all duration-300 ease-out
                     hover:shadow-[0_6px_20px_rgba(101,216,48,0.4),0_0_0_1px_rgba(101,216,48,0.3)]
                     hover:scale-[1.05]
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                </button>

                {/* Edge fades */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-background to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent" />
            </div>

            {/* View all */}
            <div className="mt-6">
                <a
                    href={`/courses?tag=${encodeURIComponent(active)}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-lime-300 hover:text-lime-200"
                >
                    Explore all {active} courses
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </section>
    );
}
