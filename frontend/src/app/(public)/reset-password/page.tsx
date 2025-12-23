"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import Popup from "@/core/components/public/Popup";
import { resetPassword } from "@/services/auth";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [popup, setPopup] = useState<any>(null);

  const token = searchParams.get("token");

  const mismatch = pw && pw2 && pw !== pw2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || mismatch || !pw) return;

    try {
      await resetPassword(token, pw);
      setPopup({
        type: "success",
        title: "Password reset",
        message: "You can now log in with your new password.",
        onClose: () => {
          setPopup(null);
          router.push("/login");
        },
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Failed to reset password. The link may be expired.";
      setPopup({
        type: "error",
        title: "Reset failed",
        message: msg,
        onClose: () => setPopup(null),
      });
    }
  };

  if (!token) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-300">Invalid reset link.</p>
      </main>
    );
  }

  return (
    <main className="min-h-[72vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl"
      >
        <h1 className="text-2xl font-semibold mb-2">Reset password</h1>

        <label className="block text-sm mb-2" htmlFor="password">
          New password
        </label>
        <div className="relative mb-4">
          <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input
            id="password"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full rounded-xl bg-slate-800/60 border border-white/10 py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
          />
        </div>

        <label className="block text-sm mb-2" htmlFor="password2">
          Confirm password
        </label>
        <div className="relative mb-2">
          <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input
            id="password2"
            type="password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            className="w-full rounded-xl bg-slate-800/60 border border-white/10 py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
          />
        </div>
        {mismatch && (
          <p className="text-xs text-red-400 mb-3">Passwords do not match.</p>
        )}

        <button
          type="submit"
          disabled={!pw || !!mismatch}
          className="w-full rounded-xl py-3 font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-900)] disabled:opacity-50 transition"
        >
          Reset password
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
