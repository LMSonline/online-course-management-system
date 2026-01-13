import React, { useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { ExternalLink, Lock, QrCode } from "lucide-react";
import { learnerPaymentService } from "@/services/learner/paymentService";
import EnrollStepResult from "./EnrollStepResult";

interface EnrollStepPaymentProps {
  onNext: (data: any) => void;
  enrollmentData: any;
}

const paymentMethods = [
  {
    id: "vnpay",
    name: "VNPAY",
    logo: "/images/payment/vnpay.png",
    desc: "Fast bank transfer via VNPAY",
  },
  {
    id: "momo",
    name: "MoMo",
    logo: "/images/payment/momo.png",
    desc: "Pay instantly with MoMo wallet",
  },
];

// giả lập link QR
const MOCK_PAYMENT_URL =
  "https://img.vietqr.io/image/970422-123456789-qr_only.png";

const EnrollStepPayment: React.FC<EnrollStepPaymentProps> = ({
  onNext,
  enrollmentData,
}) => {
  const [selected, setSelected] = useState(paymentMethods[0].id);
  const [showQR, setShowQR] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const total = useMemo(
    () => Number(enrollmentData?.price ?? 0),
    [enrollmentData]
  );

  const handlePay = async () => {
    setError(null);
    setLoading(true);
    try {
      const courseId = enrollmentData?.courseId;
      const versionId = enrollmentData?.id
        ? Number(enrollmentData.id)
        : undefined;

      if (!courseId || !versionId)
        throw new Error("Thiếu courseId hoặc courseVersionId");

      const paymentRes = await learnerPaymentService.createPayment(
        courseId,
        versionId,
        selected.toUpperCase(),
        window.location.origin + "/payment/callback"
      );

      setPaymentUrl(paymentRes.paymentUrl || "");
      setShowQR(true);
    } catch (err: any) {
      setError(err?.message || "Không thể tạo payment, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDone = async () => {
    setLoading(true);
    setError(null);
    try {
      // Giả lập đăng ký thành công, chuyển sang kết quả
      setShowResult(true);
      // Đánh dấu bước 2 hoàn thành, chuyển sang bước 3 (EnrollStepper sẽ nhận onNext và chuyển step)
    } catch (err: any) {
      setError(err?.message || "Không thể enroll, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showResult && window && window.parent) {
      // Nếu component này nằm trong EnrollStepper, gọi onNext để chuyển step
      onNext({ success: true });
    }
  }, [showResult, onNext]);

  if (showResult) {
    return (
      <EnrollStepResult
        result={{ success: true }}
        onReset={() => {
          window.location.href = "http://localhost:3000/learner/courses/bachelor-of-law-little-b/learn";
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Payment method</h2>
        <p className="mt-1 text-sm text-slate-400">
          Choose a method and complete the payment securely.
        </p>
      </div>

      {/* Summary mini */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">Total</div>
          <div className="text-xl font-extrabold text-white">
            {total.toLocaleString()}₫
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5" />
          Encrypted & secure checkout
        </div>
      </div>

      {error && (
        <div className="mb-4 text-red-500 text-sm font-semibold">
          {error}
        </div>
      )}

      {!showQR ? (
        <>
          <div className="grid gap-3">
            {paymentMethods.map((pm) => {
              const active = selected === pm.id;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setSelected(pm.id)}
                  className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition
                    ${
                      active
                        ? "border-[var(--brand-600)] bg-slate-900 shadow-[0_18px_60px_rgba(0,0,0,0.25)]"
                        : "border-white/10 bg-slate-900/40 hover:bg-slate-900/70"
                    }`}
                >
                  <img src={pm.logo} alt={pm.name} className="h-10 w-10" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white">
                      {pm.name}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">
                      {pm.desc}
                    </div>
                  </div>

                  <div
                    className={`h-4 w-4 rounded-full border transition
                      ${
                        active
                          ? "border-[var(--brand-400)] bg-[var(--brand-600)]"
                          : "border-slate-600 bg-transparent"
                      }`}
                  />
                </button>
              );
            })}
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full rounded-2xl bg-[var(--brand-600)] py-3.5 text-sm font-semibold text-white hover:bg-[var(--brand-700)] transition shadow-[0_14px_40px_rgba(0,0,0,0.35)] disabled:opacity-60"
          >
            {loading ? "Đang tạo mã QR..." : "Generate QR & Pay"}
          </button>

          <p className="text-center text-[11px] text-slate-500">
            You’ll be shown a QR code to complete the payment.
          </p>
        </>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-5">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-white">
            <QrCode className="h-4 w-4 text-[var(--brand-400)]" />
            Scan QR to complete payment
          </div>

          <div className="mt-4 flex flex-col items-center">
            <div className="rounded-2xl bg-slate-950 p-4 shadow-inner">
              {paymentUrl ? (
                <QRCodeCanvas
                  value={paymentUrl}
                  size={224}
                  className="bg-white rounded-xl p-2"
                />
              ) : (
                <div className="h-56 w-56 flex items-center justify-center text-slate-400">
                  Không có QR code
                </div>
              )}
            </div>

            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-400)] hover:text-[var(--brand-300)] transition"
            >
              Open payment link <ExternalLink size={16} />
            </a>

            <div className="mt-4 w-full">
              <button
                onClick={handleDone}
                className="w-full rounded-2xl bg-emerald-500 py-3.5 text-sm font-semibold text-white hover:bg-emerald-600 transition shadow-[0_14px_40px_rgba(0,0,0,0.35)]"
              >
                I’ve completed the payment
              </button>

              <p className="mt-2 text-center text-[11px] text-slate-500">
                Click only after your wallet/bank confirms successful payment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollStepPayment;
