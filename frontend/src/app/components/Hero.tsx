"use client";
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";
import SearchBar from "./SearchBar";


export default function Hero() {
    const ref = useRef<HTMLDivElement>(null);


    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-title", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out" });
            gsap.from(".hero-sub", { y: 16, opacity: 0, duration: 0.9, delay: 0.1 });
            gsap.from(".hero-cta", { y: 12, opacity: 0, duration: 0.9, delay: 0.2 });
        }, ref);
        return () => ctx.revert();
    }, []);


    return (
        <section ref={ref} className="relative overflow-hidden">
            <div className="absolute -inset-24 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(134,239,74,0.20),transparent_60%)]" />
            <div className="container mx-auto px-4 py-16 md:py-28 relative">
                <h1 className="hero-title text-4xl md:text-6xl font-extrabold leading-tight">
                    Học mọi kỹ năng
                    <span className="text-brand drop-shadow-[0_0_18px_rgba(134,239,74,0.55)]"> nhanh hơn</span> với LMS Neon
                </h1>
                <p className="hero-sub mt-4 max-w-2xl text-slate-300">
                    Giao diện giống Udemy, màu chủ đề neon lime theo logo Samurai Panda. Hiệu ứng mượt mà với GSAP.
                </p>
                <div className="hero-cta mt-6 max-w-2xl"><SearchBar /></div>
                <div className="mt-6 flex gap-3">
                    <a className="btn btn-primary" href="/courses">Bắt đầu học <ArrowRight size={16} /></a>
                    <a className="btn btn-outline" href="#">Xem lộ trình</a>
                </div>
            </div>
        </section>
    );
}