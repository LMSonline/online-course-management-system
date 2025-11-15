"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Check,
  GraduationCap,
} from "lucide-react";

type Role = "learner" | "instructor";

export default function SignupPage() {
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [agree, setAgree] = useState(false);
  const [role, setRole] = useState<Role>("learner");

  const pwCheck = useMemo(() => {
    const hasLength = pw.length >= 8;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /\d/.test(pw);
    const hasSymbol = /[^A-Za-z0-9]/.test(pw);

    let s = 0;
    if (hasLength) s++;
    if (hasUpper) s++;
    if (hasLower) s++;
    if (hasNumber) s++;
    if (hasSymbol) s++;

    return {
      strength: Math.min(s, 4), // 0..4
      hasLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSymbol,
    };
  }, [pw]);

  const mismatch = pw && pw2 && pw !== pw2;
  const canSubmit = !!(
    name &&
    email &&
    pw &&
    !mismatch &&
    agree &&
    pwCheck.strength >= 3
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: call API register với role, name, email, pw
    // ví dụ: api.register({ name, email, password: pw, role })
    alert(`Signed up as ${role}! (hook up API later)`);
  }

  return (
    <main className="min-h-[72vh]">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-2 items-start">
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
            <label htmlFor="name" className="block text-sm mb-2">
              Full name
            </label>
            <div className="relative mb-4">
              <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl bg-slate-800/60 border border-white/10 py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
              />
            </div>

            {/* Email */}
            <label htmlFor="email" className="block text-sm mb-2">
              Email
            </label>
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

            {/* Role selector */}
            <p className="block text-sm mb-2">I&apos;m signing up as</p>
            <div className="mb-5 flex gap-3">
              <button
                type="button"
                onClick={() => setRole("learner")}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition ${role === "learner"
                    ? "bg-[var(--brand-600)] text-white border-[var(--brand-600)]"
                    : "bg-slate-800/60 text-slate-200 border-white/10 hover:border-[var(--brand-600)]/60"
                  }`}
              >
                <User className="size-4" />
                Learner
              </button>
              <button
                type="button"
                onClick={() => setRole("instructor")}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition ${role === "instructor"
                    ? "bg-[var(--brand-600)] text-white border-[var(--brand-600)]"
                    : "bg-slate-800/60 text-slate-200 border-white/10 hover:border-[var(--brand-600)]/60"
                  }`}
              >
                <GraduationCap className="size-4" />
                Instructor
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              You can adjust your role later in your profile settings.
            </p>

            {/* Password */}
            <label htmlFor="password" className="block text-sm mb-2">
              Password
            </label>
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
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPw ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>

            {/* Strength bar */}
            <div className="h-1.5 rounded bg-white/10 overflow-hidden mb-2">
              <div
                className="h-full bg-[var(--brand-600)] transition-all"
                style={{ width: `${(pwCheck.strength / 4) * 100}%` }}
              />
            </div>

            {/* Password checklist */}
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-400 mb-4">
              {[
                { ok: pwCheck.hasLength, label: "At least 8 characters" },
                { ok: pwCheck.hasUpper, label: "One uppercase letter" },
                { ok: pwCheck.hasLower, label: "One lowercase letter" },
                { ok: pwCheck.hasNumber, label: "One number" },
                { ok: pwCheck.hasSymbol, label: "One symbol" },
              ].map((rule, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${rule.ok
                        ? "bg-[var(--brand-600)] border-[var(--brand-600)] text-white"
                        : "border-white/20 text-slate-500"
                      }`}
                  >
                    <Check className="size-3" />
                  </span>
                  <span
                    className={rule.ok ? "text-slate-200" : "text-slate-400"}
                  >
                    {rule.label}
                  </span>
                </li>
              ))}
            </ul>

            {/* Confirm password */}
            <label htmlFor="password2" className="block text-sm mb-2">
              Confirm password
            </label>
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
                onClick={() => setShowPw2((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPw2 ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            {mismatch && (
              <p className="text-xs text-red-400 mt-2">
                Passwords do not match.
              </p>
            )}

            {/* Terms */}
            <label className="inline-flex items-center gap-2 text-sm mt-5 mb-6 select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-slate-800/60"
              />
              <span>
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-[var(--brand-600)] hover:opacity-90"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-[var(--brand-600)] hover:opacity-90"
                >
                  Privacy Policy
                </Link>
                .
              </span>
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
              <span className="text-xs uppercase tracking-wider text-slate-400">
                or
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Socials */}
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-slate-800/40 py-2.5 hover:bg-slate-800/70 transition"
              >
                Continue with Google
              </button>
              <button
                type="button"
                className="rounded-xl border border-white/10 bg-slate-800/40 py-2.5 hover:bg-slate-800/70 transition"
              >
                Continue with Facebook
              </button>
            </div>

            {/* Link to login */}
            <p className="text-sm text-slate-400 mt-6 text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[var(--brand-600)] hover:opacity-90"
              >
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
