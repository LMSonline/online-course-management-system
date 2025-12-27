"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations/auth.schema";
import { useForgotPassword } from "@/hooks/useAuth";
import Popup, { PopupType } from "@/core/components/public/Popup";

export default function ForgotPasswordPage() {
  const [popup, setPopup] = useState<{
    type: PopupType;
    title: string;
    message: string;
    onClose: () => void;
  } | null>(null);

  const { mutate: sendResetLink, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    sendResetLink(
      { email: data.email },
      {
        onSuccess: () => {
          setPopup({
            type: "success",
            title: "Email sent!",
            message:
              "We've sent password reset instructions to your email. Please check your inbox.",
            onClose: () => setPopup(null),
          });
        },
      }
    );
  };

  return (
    <main className="min-h-[72vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Forgot password?</h1>
            <p className="text-sm text-slate-400 mt-1">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          {/* Email */}
          <label className="block text-sm mb-2" htmlFor="email">
            Email address
          </label>
          <div className="relative mb-1">
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              disabled={isPending}
              className="w-full rounded-xl bg-slate-800/60 border border-white/10 px-4 py-3 pr-11 outline-none focus:ring-2 focus:ring-[var(--brand-600)] disabled:opacity-50"
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          </div>
          {errors.email && (
            <p className="text-sm text-red-400 mb-3 mt-1">
              {errors.email.message}
            </p>
          )}
          {!errors.email && <div className="mb-5" />}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl py-3 font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-900)] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mb-4"
          >
            {isPending && <Loader2 className="size-5 animate-spin" />}
            {isPending ? "Sending..." : "Send reset link"}
          </button>

          {/* Back to Login */}
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-[var(--brand-600)] transition"
          >
            <ArrowLeft className="size-4" />
            Back to login
          </Link>
        </form>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-[var(--brand-600)] hover:opacity-90"
            >
              Sign in
            </Link>
          </p>
        </div>
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
