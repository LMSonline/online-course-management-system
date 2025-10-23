"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, Check } from "lucide-react";

export default function SignupPage() {
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [agree, setAgree] = useState(false);

  const pwStrength = useMemo(() => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[a-z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return Math.min(s, 4); // 0..4
  }, [pw]);

  const mismatch = pw && pw2 && pw !== pw2;
  const canSubmit = name && email && pw && !mismatch && agree;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: call API register
    alert("Signed up! (hook up API later)");
  }

  return (
    <main className="min-h-[72vh]">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          {/* ==== Left: Sign up card ==== */}
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl"
          >
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Create your account</h1>
              <p className="text-sm text-slate-400 mt-1">
                Join LMS and start learning today.
              </p>
            </div>

            {/* Full name */}
            <label htmlFor="name" className="block text-sm mb-2">Full name</label>
            <div className="relative mb-4">
              <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Trương Ngọc Hân"
                className="w-full rounded-xl bg-slate-800/60 border border-white/10 py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
              />
            </div>

            {/* Email */}
            <label htmlFor="email" className="block text-sm mb-2">Email</label>
            <div className="relative mb-4">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl bg-slate-800/60 border border-white/10 py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
              />
            </div>

            {/* Password */}
            <label htmlFor="password" className="block text-sm mb-2">Password</label>
            <div className="relative mb-2">
              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                id="password"
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-xl bg-slate-800/60 border border-white/10 py-3 pl-10 pr-11 outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
              />
              <button
                type="button"
                aria-label={showPw ? "Hide password" : "Show password"}
                onClick={() => setShowPw(v => v ? false : true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPw ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>

            {/* Strength bar */}
            <div className="h-1.5 rounded bg-white/10 overflow-hidden mb-4">
              <div
                className="h-full bg-[var(--brand-600)] transition-all"
                style={{ width: `${(pwStrength / 4) * 100}%` }}
              />
            </div>

            {/* Confirm password */}
            <label htmlFor="password2" className="block text-sm mb-2">Confirm password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                id="password2"
                type={showPw2 ? "text" : "password"}
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-xl bg-slate-800/60 border border-white/10 py-3 pl-10 pr-11 outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
              />
              <button
                type="button"
                aria-label={showPw2 ? "Hide password" : "Show password"}
                onClick={() => setShowPw2(v => v ? false : true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPw2 ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            {mismatch && (
              <p className="text-xs text-red-400 mt-2">Passwords do not match.</p>
            )}

            {/* Terms */}
            <label className="inline-flex items-center gap-2 text-sm mt-5 mb-6 select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-slate-800/60"
              />
              I agree to the{" "}
              <Link href="/terms" className="text-[var(--brand-600)] hover:opacity-90">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[var(--brand-600)] hover:opacity-90">
                Privacy Policy
              </Link>.
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-xl py-3 font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-900)] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Create account
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-wider text-slate-400">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Socials */}
            <div className="grid sm:grid-cols-2 gap-3">
              <button type="button" className="rounded-xl border border-white/10 bg-slate-800/40 py-2.5 hover:bg-slate-800/70 transition">
                Continue with Google
              </button>
              <button type="button" className="rounded-xl border border-white/10 bg-slate-800/40 py-2.5 hover:bg-slate-800/70 transition">
                Continue with Apple
              </button>
            </div>

            {/* Link to login */}
            <p className="text-sm text-slate-400 mt-6 text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-[var(--brand-600)] hover:opacity-90">
                Log in
              </Link>
            </p>
          </form>

          {/* ==== Right: Promo green panel ==== */}
          <aside className="hidden md:block">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 p-8 min-h-[360px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[color:rgb(var(--brand-600-rgb,63_163_55))]/15 via-transparent to-[color:rgb(var(--brand-900-rgb,45_90_39))]/25" />
              <div className="relative">
                <h2 className="text-3xl font-bold">Why join LMS?</h2>
                <p className="mt-2 text-slate-300">
                  Track progress, get certificates, and access courses anytime.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Personalized recommendations",
                    "Lifetime course access",
                    "Certificates upon completion",
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
