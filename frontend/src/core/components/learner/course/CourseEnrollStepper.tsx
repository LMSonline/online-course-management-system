import React, { useState } from "react";
import { paymentService } from "@/services/payment/payment.service";
import { Check, Info, Lock, ShieldCheck } from "lucide-react";
import type { CourseDetail } from "@/lib/learner/course/types";

interface CourseEnrollStepperProps {
  course: CourseDetail;
  onClose: () => void;
  onEnroll: (notes?: string, paymentTransactionId?: number | null) => Promise<void>;
  loading: boolean;
  enrolled: boolean;
}

const steps = [
  { title: "Confirm information", icon: Info },
  { title: "Agree to terms", icon: ShieldCheck },
  { title: "Enrollment complete", icon: Check },
];

export default function CourseEnrollStepper({
  course,
  onClose,
  onEnroll,
  loading,
  enrolled,
}: CourseEnrollStepperProps) {
  const [step, setStep] = useState(0);
  const [agree, setAgree] = useState(false);
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [waitingPayment, setWaitingPayment] = useState(false);
  const [transactionId, setTransactionId] = useState<number | null>(null);

  const handleNext = async () => {
    setError(null);
    if (step === 1) {
      if (typeof course.price === 'number' && course.price > 0) {
        // Paid course: create payment
        setWaitingPayment(true);
        try {
          const paymentRes = await paymentService.createPayment(course.id, course.price);
          setPaymentUrl(paymentRes.paymentUrl);
          setTransactionId(paymentRes.transactionId);
          // Open payment in new tab
          window.open(paymentRes.paymentUrl, '_blank');
        } catch (e: any) {
          setError(e?.message || 'Failed to initiate payment.');
        } finally {
          setWaitingPayment(false);
        }
      } else {
        try {
          await onEnroll(notes);
          setSuccess(true);
          setStep(2);
        } catch (e: any) {
          setError(e?.message || "Enrollment failed. Please try again.");
        }
      }
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    setStep((s) => s - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-xl bg-slate-950 border border-emerald-400/30 rounded-3xl shadow-2xl p-10 relative animate-fadeIn">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, idx) => (
            <div key={s.title} className="flex-1 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step === idx
                    ? "bg-emerald-500 border-emerald-400 text-black"
                    : step > idx
                    ? "bg-green-900/30 border-green-400 text-green-400"
                    : "bg-[#1a2237] border-gray-700 text-gray-500"
                }`}
              >
                {step > idx ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <s.icon className="w-5 h-5" />
                )}
              </div>
              <div
                className={`mt-2 text-xs font-medium ${
                  step === idx ? "text-emerald-400" : "text-gray-400"
                }`}
              >
                {s.title}
              </div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              Confirm course information
            </h3>
            <div className="bg-slate-900/80 border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <img
                  src={
                    course.instructor?.avatarUrl ||
                    "/images/course-default.png"
                  }
                  alt={course.title}
                  className="w-20 h-14 rounded-lg object-cover bg-slate-800"
                />
                <div>
                  <div className="font-semibold text-white text-base line-clamp-1">
                    {course.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {course.instructor?.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {course.level} · {course.language}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-emerald-400 font-bold">
                  {course.price === 0
                    ? "Free"
                    : typeof course.price === "number"
                    ? `$${course.price.toFixed(2)}`
                    : "Contact us"}
                </span>
                {typeof course.price === "number" && course.price > 0 && (
                  <span className="text-xs text-slate-400">
                    (Payment required upon enrollment)
                  </span>
                )}
              </div>
            </div>
            <textarea
              className="w-full mt-2 bg-slate-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400 resize-none"
              rows={2}
              placeholder="Notes for the instructor (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Terms & Commitments
            </h3>
            <div className="bg-slate-900/80 border border-white/10 rounded-lg p-6 text-base text-slate-300">
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  You commit to studying seriously and not sharing your account.
                </li>
                <li>30-day refund policy for all courses.</li>
                <li>
                  For paid courses, payment is required to access full content.
                </li>
              </ul>
            </div>
            <label className="flex items-center gap-3 text-base text-slate-200">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="accent-emerald-500 w-5 h-5"
              />
              I have read and agree to the terms above
            </label>
            {error && (
              <div className="text-red-400 text-base mt-2">{error}</div>
            )}
            {/* Payment step for paid course */}
            {paymentUrl && (
              <div className="mt-6 p-4 bg-emerald-900/10 border border-emerald-400/30 rounded-lg text-emerald-300 text-center text-base">
                Please complete your payment in the new tab.<br />
                After payment, click the button below to finish enrollment.
                <button
                  className="block w-full mt-4 rounded-xl bg-emerald-600 py-2.5 text-base font-semibold text-white hover:bg-emerald-700 transition"
                  disabled={waitingPayment}
                  onClick={async () => {
                    setError(null);
                    try {
                      // Poll payment status (for demo, just try enroll with mock transactionId)
                      await onEnroll(notes, transactionId ?? 123456);
                      setSuccess(true);
                      setStep(2);
                    } catch (e: any) {
                      setError(e?.message || 'Enrollment failed. Please try again.');
                    }
                  }}
                >
                  Finish Enrollment
                </button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center py-8">
            {success ? (
              <>
                <div className="bg-emerald-500/10 border border-emerald-400 rounded-full p-4 mb-4">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-lg font-semibold text-emerald-300 mb-2">
                  Enrollment successful!
                </div>
                <div className="text-slate-300 text-sm mb-4 text-center">
                  You have successfully enrolled in this course. Start learning
                  now!
                </div>
                <button
                  className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                  onClick={onClose}
                >
                  Start learning
                </button>
              </>
            ) : (
              <div className="text-slate-300 text-center">
                Processing enrollment...
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {step < 2 && !paymentUrl && (
          <div className="mt-10 flex justify-between gap-4">
            <button
              className="px-7 py-3 rounded-lg border border-white/10 bg-slate-800 text-slate-300 hover:bg-slate-700 text-base transition"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            {step > 0 && (
              <button
                className="px-7 py-3 rounded-lg border border-white/10 bg-slate-800 text-slate-300 hover:bg-slate-700 text-base transition"
                onClick={handleBack}
                disabled={loading}
              >
                Back
              </button>
            )}
            <button
              className="px-7 py-3 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-600 text-base transition disabled:opacity-60"
              onClick={handleNext}
              disabled={loading || (step === 1 && !agree) || waitingPayment}
            >
              {step === 1
                ? waitingPayment
                  ? "Redirecting to payment..."
                  : typeof course.price === 'number' && course.price > 0
                    ? "Proceed to Payment"
                    : loading
                      ? "Enrolling..."
                      : "Confirm & Enroll"
                : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
