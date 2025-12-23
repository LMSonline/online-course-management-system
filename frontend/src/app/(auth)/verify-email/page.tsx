"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  ArrowRight,
} from "lucide-react";
import {
  verifyEmailSchema,
  type VerifyEmailFormData,
} from "@/lib/validations/auth.schema";
import {
  useVerifyEmail,
  useResendVerificationEmail,
} from "@/hooks/useAuth";

type PopupType = "success" | "error" | "warning" | "info";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showResendForm, setShowResendForm] = useState(false);

  const { mutate: verifyEmail } = useVerifyEmail();
  const { mutate: resendEmail, isPending: isResending } =
    useResendVerificationEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setVerificationStatus("error");
      setErrorMessage("Verification token is missing.");
      return;
    }

    verifyEmail(token, {
      onSuccess: () => {
        setVerificationStatus("success");
      },
      onError: (error) => {
        setVerificationStatus("error");
        setErrorMessage(
          error.message || "Verification failed. The link may be expired."
        );
      },
    });
  }, [token, verifyEmail]);

  const onResendSubmit = (data: VerifyEmailFormData) => {
    resendEmail(data.email, {
      onSuccess: () => {
        setShowResendForm(false);
      },
    });
  };

  // Loading State
  if (verificationStatus === "loading") {
    return (
      <main className="min-h-[72vh] flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="size-12 animate-spin text-[var(--brand-600)] mx-auto mb-4" />
          <h1 className="text-xl font-semibold mb-2">Verifying your email...</h1>
          <p className="text-sm text-slate-400">Please wait a moment</p>
        </div>
      </main>
    );
  }

  // Success State
  if (verificationStatus === "success") {
    return (
      <main className="min-h-[72vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-slate-900/40 border border-white/10 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
            <CheckCircle2 className="size-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Email verified!</h1>
          <p className="text-sm text-slate-400 mb-6">
            Your account has been successfully verified. You can now sign in and
            start learning.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-900)] transition"
          >
            Sign in to your account
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );
  }

  // Error State
  return (
    <main className="min-h-[72vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
            <AlertCircle className="size-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Verification failed</h1>
          <p className="text-sm text-slate-400 mb-6">{errorMessage}</p>

          {!showResendForm ? (
            <div className="space-y-3">
              <button
                onClick={() => setShowResendForm(true)}
                className="w-full rounded-xl px-6 py-3 font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-900)] transition"
              >
                Resend verification email
              </button>
              <Link
                href="/login"
                className="block text-sm text-slate-400 hover:text-[var(--brand-600)] transition"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onResendSubmit)} className="space-y-4">
              <div className="text-left">
                <label className="block text-sm mb-2" htmlFor="email">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    disabled={isResending}
                    className="w-full rounded-xl bg-slate-800/60 border border-white/10 px-4 py-3 pr-11 outline-none focus:ring-2 focus:ring-[var(--brand-600)] disabled:opacity-50"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isResending}
                className="w-full rounded-xl py-3 font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-900)] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {isResending && <Loader2 className="size-5 animate-spin" />}
                {isResending ? "Sending..." : "Send verification email"}
              </button>

              <button
                type="button"
                onClick={() => setShowResendForm(false)}
                className="w-full text-sm text-slate-400 hover:text-[var(--brand-600)] transition"
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Need help?{" "}
            <Link
              href="/login"
              className="text-[var(--brand-600)] hover:opacity-90"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[72vh] flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[var(--brand-600)]" />
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
