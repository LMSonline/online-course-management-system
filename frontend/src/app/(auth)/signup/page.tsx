"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Eye, EyeOff, Check, GraduationCap, Loader2 } from "lucide-react";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth.schema";
import { useRegister } from "@/hooks/useAuth";
import Popup, { PopupType } from "@/core/components/public/Popup";

export default function SignupPage() {
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [agree, setAgree] = useState(false);
  const [popup, setPopup] = useState<{
    type: PopupType;
    title: string;
    message: string;
    actions?: React.ReactNode;
    onClose: () => void;
  } | null>(null);

  const { mutate: register, isPending } = useRegister();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "STUDENT",
    },
  });

  const password = watch("password");
  const role = watch("role");

  // Password strength logic
  const pwCheck = useMemo(() => {
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const score = [hasLength, hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

    return { hasLength, hasUpper, hasLower, hasNumber, hasSymbol, strength: Math.min(score, 4) };
  }, [password]);

  const onSubmit = (data: RegisterFormData) => {
    if (!agree) {
      setPopup({
        type: "error",
        title: "Terms and Conditions",
        message: "Please agree to the Terms and Privacy Policy to continue.",
        onClose: () => setPopup(null),
      });
      return;
    }

    register({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
      langKey: "en",
    });
  };


  return (
    <main className="min-h-[72vh]">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-2 items-start">
          {/* ==== Left: Sign up card ==== */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl"
          >
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Create your account</h1>
              <p className="text-sm text-slate-400 mt-1">
                Join LMS and start learning today.
              </p>
            </div>

            {/* User name */}
            <label htmlFor="name" className="block text-sm mb-2">
              User name
            </label>
            <div className="relative mb-1">
              <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                id="name"
                {...registerField("username")}
                disabled={isPending}
                placeholder="Enter your username"
                className="w-full rounded-xl bg-slate-800/60 border border-white/10 py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-[var(--brand-600)] disabled:opacity-50"
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-400 mb-3 mt-1">{errors.username.message}</p>
            )}
            {!errors.username && <div className="mb-4" />}

            {/* Email */}
            <label htmlFor="email" className="block text-sm mb-2">
              Email
            </label>
            <div className="relative mb-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                id="email"
                type="email"
                {...registerField("email")}
                disabled={isPending}
                placeholder="you@example.com"
                className="w-full rounded-xl bg-slate-800/60 border border-white/10 py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-[var(--brand-600)] disabled:opacity-50"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-400 mb-3 mt-1">{errors.email.message}</p>
            )}
            {!errors.email && <div className="mb-4" />}

            {/* Role selector */}
            <p className="block text-sm mb-2">I&apos;m signing up as</p>
            <input type="hidden" {...registerField("role")} />
            <div className="mb-1 flex gap-3">
              <button
                type="button"
                onClick={() => setValue("role", "STUDENT")}
                disabled={isPending}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition disabled:opacity-50 ${role === "STUDENT"
                  ? "bg-[var(--brand-600)] text-white border-[var(--brand-600)]"
                  : "bg-slate-800/60 text-slate-200 border-white/10 hover:border-[var(--brand-600)]/60"
                  }`}
              >
                <User className="size-4" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setValue("role", "TEACHER")}
                disabled={isPending}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition disabled:opacity-50 ${role === "TEACHER"
                  ? "bg-[var(--brand-600)] text-white border-[var(--brand-600)]"
                  : "bg-slate-800/60 text-slate-200 border-white/10 hover:border-[var(--brand-600)]/60"
                  }`}
              >
                <GraduationCap className="size-4" />
                Teacher
              </button>
            </div>
            {errors.role && (
              <p className="text-sm text-red-400 mt-1">{errors.role.message}</p>
            )}
            <p className="text-xs text-slate-400 my-4">
              You can adjust your role later in your profile settings.
            </p>

            {/* Password */}
            <label htmlFor="password" className="block text-sm mb-2">
              Password
            </label>
            <div className="relative mb-1">
              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                id="password"
                type={showPw ? "text" : "password"}
                {...registerField("password")}
                disabled={isPending}
                placeholder="At least 8 characters"
                className="w-full rounded-xl bg-slate-800/60 border border-white/10 py-3 pl-10 pr-11 outline-none focus:ring-2 focus:ring-[var(--brand-600)] disabled:opacity-50"
              />
              <button
                type="button"
                aria-label={showPw ? "Hide password" : "Show password"}
                onClick={() => setShowPw((v) => !v)}
                disabled={isPending}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 disabled:opacity-50"
              >
                {showPw ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-400 mb-1 mt-1">{errors.password.message}</p>
            )}

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
            <div className="relative mb-1">
              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
              <input
                id="password2"
                type={showPw2 ? "text" : "password"}
                {...registerField("confirmPassword")}
                disabled={isPending}
                placeholder="Re-enter your password"
                className="w-full rounded-xl bg-slate-800/60 border border-white/10 py-3 pl-10 pr-11 outline-none focus:ring-2 focus:ring-[var(--brand-600)] disabled:opacity-50"
              />
              <button
                type="button"
                aria-label={showPw2 ? "Hide password" : "Show password"}
                onClick={() => setShowPw2((v) => !v)}
                disabled={isPending}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 disabled:opacity-50"
              >
                {showPw2 ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1 mb-2">
                {errors.confirmPassword.message}
              </p>
            )}

            {/* Terms */}
            <label className="inline-flex items-center gap-2 text-sm mt-5 mb-6 select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                disabled={isPending}
                className="h-4 w-4 rounded border-white/20 bg-slate-800/60 disabled:opacity-50"
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
              disabled={isPending}
              className="w-full rounded-xl py-3 font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-900)] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 className="size-5 animate-spin" />}
              {isPending ? "Creating account..." : "Create account"}
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
      {/* POPUP RENDER */}
      {popup && (
        <Popup
          type={popup.type}
          title={popup.title}
          message={popup.message}
          actions={popup.actions}
          open={true}
          onClose={popup.onClose}
        />
      )}
    </main>
  );
}