"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, Check, Loader2, AlertCircle } from "lucide-react";
import {
    resetPasswordSchema,
    type ResetPasswordFormData,
} from "@/lib/validations/auth.schema";
import { useResetPassword } from "@/hooks/useAuth";
import Popup, { PopupType } from "@/core/components/public/Popup";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [showPw, setShowPw] = useState(false);
    const [showPw2, setShowPw2] = useState(false);
    const [popup, setPopup] = useState<{
        type: PopupType;
        title: string;
        message: string;
        onClose: () => void;
    } | null>(null);

    const { mutate: resetPassword, isPending } = useResetPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");

    // Password strength logic
    const pwCheck = useMemo(() => {
        const hasLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);

        const score = [hasLength, hasUpper, hasLower, hasNumber, hasSymbol].filter(
            Boolean
        ).length;

        return {
            hasLength,
            hasUpper,
            hasLower,
            hasNumber,
            hasSymbol,
            strength: Math.min(score, 4),
        };
    }, [password]);

    const onSubmit = (data: ResetPasswordFormData) => {
        if (!token) {
            setPopup({
                type: "error",
                title: "Invalid Link",
                message: "Password reset token is missing or invalid.",
                onClose: () => setPopup(null),
            });
            return;
        }

        resetPassword({
            token,
            newPassword: data.password,
        });
    };

    if (!token) {
        return (
            <main className="min-h-[72vh] flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-slate-900/40 border border-white/10 rounded-2xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4">
                        <AlertCircle className="size-6 text-red-500" />
                    </div>
                    <h1 className="text-xl font-semibold mb-2">Invalid Reset Link</h1>
                    <p className="text-sm text-slate-400 mb-6">
                        This password reset link is invalid or has expired.
                    </p>
                    <Link
                        href="/forgot-password"
                        className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-900)] transition"
                    >
                        Request New Link
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[72vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl"
                >
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold">Set new password</h1>
                        <p className="text-sm text-slate-400 mt-1">
                            Please enter your new password below.
                        </p>
                    </div>

                    {/* New Password */}
                    <label htmlFor="password" className="block text-sm mb-2">
                        New password
                    </label>
                    <div className="relative mb-1">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <input
                            id="password"
                            type={showPw ? "text" : "password"}
                            {...register("password")}
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
                        <p className="text-sm text-red-400 mb-1 mt-1">
                            {errors.password.message}
                        </p>
                    )}

                    {/* Strength bar */}
                    <div className="h-1.5 rounded bg-white/10 overflow-hidden mb-2 mt-2">
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
                                <span className={rule.ok ? "text-slate-200" : "text-slate-400"}>
                                    {rule.label}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Confirm Password */}
                    <label htmlFor="confirmPassword" className="block text-sm mb-2">
                        Confirm new password
                    </label>
                    <div className="relative mb-1">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <input
                            id="confirmPassword"
                            type={showPw2 ? "text" : "password"}
                            {...register("confirmPassword")}
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
                            {showPw2 ? (
                                <EyeOff className="size-5" />
                            ) : (
                                <Eye className="size-5" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-xs text-red-400 mt-1 mb-2">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                    {!errors.confirmPassword && <div className="mb-5" />}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full rounded-xl py-3 font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-900)] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                        {isPending && <Loader2 className="size-5 animate-spin" />}
                        {isPending ? "Resetting password..." : "Reset password"}
                    </button>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="text-sm text-slate-400 hover:text-[var(--brand-600)] transition"
                        >
                            Back to login
                        </Link>
                    </div>
                </form>
            </div>

            {popup && (
                <Popup
                    type={popup.type}
                    title={popup.title}
                    message={popup.message}
                    open={true}
                    onClose={popup.onClose}
                />
            )}
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-[72vh] flex items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-[var(--brand-600)]" />
                </main>
            }
        >
            <ResetPasswordContent />
        </Suspense>
    );
}
