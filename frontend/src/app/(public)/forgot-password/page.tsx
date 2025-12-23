"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import Popup from "@/core/components/public/Popup";
import { forgotPassword } from "@/services/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [popup, setPopup] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setPopup({
        type: "success",
        title: "Email sent",
        message: "Please check your inbox for reset instructions.",
        onClose: () => {
          setPopup(null);
          router.push("/login");
        },
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Failed to send reset email. Please try again.";
      setPopup({
        type: "error",
        title: "Request failed",
        message: msg,
        onClose: () => setPopup(null),
      });
    }
  };

  return (
    <main className="min-h-[72vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl"
      >
        <h1 className="text-2xl font-semibold mb-2">Forgot password</h1>
        <p className="text-sm text-slate-400 mb-6">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <label className="block text-sm mb-2" htmlFor="email">
          Email
        </label>
        <div className="relative mb-6">
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

        <button
          type="submit"
          disabled={!email}
          className="w-full rounded-xl py-3 font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-900)] disabled:opacity-50 transition"
        >
          Send reset link
        </button>

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
      </form>
    </main>
  );
}
