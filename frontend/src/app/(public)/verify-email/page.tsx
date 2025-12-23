"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Popup from "@/core/components/public/Popup";
import { verifyEmail } from "@/services/auth/auth.services";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [popup, setPopup] = useState<any>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setPopup({
        type: "error",
        title: "Invalid link",
        message: "Verification token is missing.",
        onClose: () => router.push("/login"),
      });
      return;
    }

    verifyEmail(token)
      .then(() => {
        setPopup({
          type: "success",
          title: "Email verified",
          message: "Your account is now active. You can log in.",
          onClose: () => router.push("/login"),
        });
      })
      .catch((err: any) => {
        const msg =
          err?.response?.data?.message ||
          "Verification failed. The link may be expired.";
        setPopup({
          type: "error",
          title: "Verification failed",
          message: msg,
          onClose: () => router.push("/login"),
        });
      });
  }, [searchParams, router]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <p className="text-slate-300">Verifying your email...</p>

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
