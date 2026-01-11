import React, { useState } from "react";
import { X } from "lucide-react";
import EnrollStepperHeader, { EnrollStep } from "./EnrollStepperHeader";
import EnrollStepCourseInfo from "./EnrollStepCourseInfo";
import EnrollStepPayment from "./EnrollStepPayment";
import EnrollStepResult from "./EnrollStepResult";

interface EnrollStepperProps {
  course: any;
  onClose?: () => void;
}

const EnrollStepper: React.FC<EnrollStepperProps> = ({ course, onClose }) => {
  const [step, setStep] = useState<EnrollStep>("course");
  const [enrollmentData, setEnrollmentData] = useState<any>(course);
  const [result, setResult] = useState<any>(null);

  const isPaidCourse = (enrollmentData?.price ?? course?.price ?? 0) > 0;

  const handleNextFromCourse = (data?: any) => {
    // giữ logic: confirm xong -> paid thì payment, free thì result
    setEnrollmentData(data ?? enrollmentData ?? course);
    if (isPaidCourse) setStep("payment");
    else {
      setResult({ success: true });
      setStep("result");
    }
  };

  const handleNextFromPayment = (data?: any) => {
    // giữ logic: payment xong -> result
    // (data có thể chứa method/paymentUrl...)
    setResult({ success: true, ...(data ?? {}) });
    setStep("result");
  };

  const handleBack = () => {
    if (step === "payment") setStep("course");
  };

  const handleClose = () => {
    setStep("course");
    setEnrollmentData(course);
    setResult(null);
    onClose?.();
  };

  const handleFinish = () => {
    // giữ logic: finish -> reset + close
    handleClose();
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 shadow-[0_45px_140px_rgba(0,0,0,0.75)]">
      {/* subtle glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[var(--brand-600)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />

      {/* HEADER */}
      <div className="relative border-b border-white/10 bg-slate-950/60 px-6 pt-5 pb-4 backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white">
              Secure checkout
            </div>
            <div className="mt-0.5 text-xs text-slate-400">
              Complete your enrollment in a few steps
            </div>
          </div>

          <button
            onClick={handleClose}
            className="shrink-0 rounded-full border border-white/10 bg-slate-900/60 p-2 text-slate-300 hover:bg-slate-900 hover:text-white transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4">
          <EnrollStepperHeader step={step} />
        </div>
      </div>

      {/* BODY */}
      <div className="relative px-6 py-6">
        {/* min-height để UI “ôm” gọn, không nhảy */}
        <div className="min-h-[320px]">
          {step === "course" && (
            <EnrollStepCourseInfo
              course={enrollmentData}
              onNext={handleNextFromCourse}
            />
          )}

          {step === "payment" && (
            <EnrollStepPayment
              enrollmentData={enrollmentData}
              onNext={handleNextFromPayment}
            />
          )}

          {step === "result" && (
            <EnrollStepResult result={result} onReset={handleFinish} />
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative border-t border-white/10 bg-slate-950/60 px-6 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          {/* LEFT */}
          {step === "payment" ? (
            <button
              onClick={handleBack}
              className="text-sm font-medium text-slate-400 hover:text-white transition"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}

          {/* RIGHT CTA */}
          {step === "course" && (
            <button
              onClick={() => handleNextFromCourse(enrollmentData)}
              className="rounded-xl bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-700)] transition shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              {isPaidCourse ? "Continue to payment" : "Enroll now"}
            </button>
          )}

          {/* Payment step: CTA nằm trong step (Pay / I’ve paid) để tránh duplicate như screenshot */}
          {step === "payment" && (
            <div className="text-xs text-slate-500">
              Choose method & complete payment above
            </div>
          )}

          {step === "result" && (
            <button
              onClick={handleFinish}
              className="rounded-xl bg-[var(--brand-600)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-700)] transition shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              Go to course
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollStepper;
