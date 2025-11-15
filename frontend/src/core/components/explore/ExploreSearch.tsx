"use client";
import { Search } from "lucide-react";
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";


export default function ExploreSearch() {
    const ref = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".explore-title", { y: 16, opacity: 0, duration: 0.6 });
            gsap.from(".explore-input", { y: 12, opacity: 0, duration: 0.6, delay: 0.1 });
            gsap.from(".explore-meta", { y: 8, opacity: 0, duration: 0.6, delay: 0.2 });
        }, ref);
        return () => ctx.revert();
    }, []);


    return (
        <div ref={ref} className="space-y-4">
            <h1 className="explore-title text-3xl md:text-4xl font-extrabold">
                Tìm kiếm <span className="text-brand drop-shadow-[0_0_18px_rgba(134,239,74,0.35)]">mọi kỹ năng</span>
            </h1>
            <div className="relative explore-input max-w-3xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} />
                <input
                    className="w-full bg-white/10 border border-white/15 focus:border-brand/60 outline-none rounded-2xl py-4 pl-12 pr-4 placeholder:text-slate-400"
                    placeholder="Tìm khoá học, chủ đề, giảng viên…"
                />
            </div>
            <p className="explore-meta text-sm text-slate-400">Gợi ý: Next.js, UI/UX, Data Analysis, IELTS…</p>
        </div>
    );
}