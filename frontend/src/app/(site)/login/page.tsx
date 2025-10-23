"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Check } from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="min-h-[72vh]">
            <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-14">
                <div className="grid gap-8 md:grid-cols-2 items-center">
                    {/* ==== Left: Login Card ==== */}
                    <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold">Log in</h1>
                            <p className="text-sm text-slate-400 mt-1">
                                Welcome back! Continue your learning journey.
                            </p>
                        </div>

                        {/* Email */}
                        <label className="block text-sm mb-2" htmlFor="email">
                            Email
                        </label>
                        <div className="relative mb-5">
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="w-full rounded-xl bg-slate-800/60 border border-white/10 px-4 py-3 pr-11 outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
                            />
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        </div>

                        {/* Password */}
                        <div className="flex items-center justify-between">
                            <label className="block text-sm" htmlFor="password">
                                Password
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-[var(--brand-600)] hover:opacity-90"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative mt-2 mb-4">
                            <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full rounded-xl bg-slate-800/60 border border-white/10 py-3 pr-11 pl-10 outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                            </button>
                        </div>


                        {/* Remember me */}
                        <label className="inline-flex items-center gap-2 text-sm mb-5 select-none">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-white/20 bg-slate-800/60"
                            />
                            Remember me
                        </label>

                        {/* Submit */}
                        <button
                            className="w-full rounded-xl py-3 font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-900)] transition"
                        >
                            Log in
                        </button>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <span className="text-xs uppercase tracking-wider text-slate-400">or</span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        {/* Socials (optional) */}
                        <div className="grid sm:grid-cols-2 gap-3">
                            <button className="rounded-xl border border-white/10 bg-slate-800/40 py-2.5 hover:bg-slate-800/70 transition">
                                Continue with Google
                            </button>
                            <button className="rounded-xl border border-white/10 bg-slate-800/40 py-2.5 hover:bg-slate-800/70 transition">
                                Continue with Apple
                            </button>
                        </div>

                        {/* Sign up link */}
                        <p className="text-sm text-slate-400 mt-6 text-center">
                            New to LMS?{" "}
                            <Link href="/signup" className="text-[var(--brand-600)] hover:opacity-90">
                                Create an account
                            </Link>
                        </p>
                    </div>

                    {/* ==== Right: Green promo panel (Udemy-like) ==== */}
                    <aside className="hidden md:block">
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 p-8 min-h-[360px]">
                            <div className="absolute inset-0 bg-gradient-to-br from-[color:rgb(var(--brand-600-rgb,63_163_55))]/15 via-transparent to-[color:rgb(var(--brand-900-rgb,45_90_39))]/25" />
                            <div className="relative">
                                <h2 className="text-3xl font-bold">
                                    Learn without limits
                                </h2>
                                <p className="mt-2 text-slate-300">
                                    Access high-quality courses and track your progress across devices.
                                </p>

                                <ul className="mt-6 space-y-3">
                                    {[
                                        "Personalized recommendations",
                                        "Lifetime access to purchased courses",
                                        "Completion certificates",
                                    ].map((t, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="mt-0.5 rounded-full p-1 bg-[var(--brand-600)]/15">
                                                <Check className="size-4 text-[var(--brand-600)]" />
                                            </span>
                                            <span>{t}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8">
                                    <Link
                                        href="/explore"
                                        className="inline-flex items-center rounded-xl px-4 py-2 font-medium bg-[var(--brand-600)] text-white hover:bg-[var(--brand-900)] transition"
                                    >
                                        Explore courses
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}
