import React, { useMemo, useState } from "react";
import { ExternalLink, Lock, QrCode } from "lucide-react";

interface EnrollStepPaymentProps {
  onNext: (data: any) => void;
  enrollmentData: any;
}

const paymentMethods = [
  { id: "vnpay", name: "VNPAY", logo: "/images/payment/vnpay.png", desc: "Fast bank transfer via VNPAY" },
  { id: "momo", name: "MoMo", logo: "/images/payment/momo.png", desc: "Pay instantly with MoMo wallet" },
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
  const [paymentUrl] = useState<string>(MOCK_PAYMENT_URL);

  const total = useMemo(() => Number(enrollmentData?.price ?? 0), [enrollmentData]);

  const handlePay = () => {
    // TODO: gọi API tạo payment thực tế, lấy paymentUrl
    setShowQR(true);
  };

  const handleDone = () => {
    onNext({ method: selected, paymentUrl });
  };

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

      {/* Methods */}
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
                      ${active ? "border-[var(--brand-400)] bg-[var(--brand-600)]" : "border-slate-600 bg-transparent"}`}
                  />
                </button>
              );
            })}
          </div>

          <button
            onClick={handlePay}
            className="w-full rounded-2xl bg-[var(--brand-600)] py-3.5 text-sm font-semibold text-white hover:bg-[var(--brand-700)] transition shadow-[0_14px_40px_rgba(0,0,0,0.35)]"
          >
            Generate QR & Pay
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
              <img
                src={paymentUrl}
                alt="QR code"
                className="h-56 w-56 rounded-xl bg-white p-2"
              />
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
