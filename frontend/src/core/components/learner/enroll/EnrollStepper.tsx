import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { learnerEnrollmentService } from "@/services/learner/enrollmentService";
import { learnerPaymentService } from "@/services/learner/paymentService";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, isLoading: userLoading } = useAuth();

  const isPaidCourse = (enrollmentData?.price ?? course?.price ?? 0) > 0;

  // Bước 1: Nếu free -> enroll luôn, nếu paid -> sang bước payment
  const handleNextFromCourse = async (data?: any) => {
    setError(null);
    setLoading(true);
    try {
      console.log("DEBUG user:", user);
      const accountId = user?.accountId;
      if (!user || !accountId) throw new Error("Bạn cần đăng nhập để đăng ký.");
      const versionId = Number(course.id);
      if (!versionId) {
        setError("Không tìm thấy courseVersionId, vui lòng thử lại hoặc liên hệ hỗ trợ.");
        setLoading(false);
        return;
      }
      if (!isPaidCourse) {
        // FREE: Gọi enroll luôn
        const enrollRes = await learnerEnrollmentService.enrollCourse(
          accountId,
          course.courseId,
          versionId
        );
        setEnrollmentData({ ...course, enrollmentId: enrollRes.enrollment.id });
        setResult({ success: true });
        setStep("result");
      } else {
        // PAID: Sang bước payment, truyền đủ courseId và versionId
        setEnrollmentData({ ...course, courseId: course.courseId, versionId });
        setStep("payment");
      }
    } catch (err: any) {
      setError(err?.message || "Đăng ký/thanh toán thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Chọn phương thức thanh toán, tạo payment, sau đó check trạng thái enrollment
  const handleNextFromPayment = async (data?: any) => {
    setError(null);
    setLoading(true);
    try {
      console.log("DEBUG user:", user);
      const accountId = user?.accountId;
      if (!user || !accountId) throw new Error("Bạn cần đăng nhập để thanh toán.");
      const courseId = course.courseId;
      const versionId = Number(course.id);
      if (!courseId || !versionId) throw new Error("Thiếu courseId hoặc courseVersionId");
      // Gọi createPayment với method và callback
      const paymentRes = await learnerPaymentService.createPayment(
        courseId,
        versionId,
        data?.method || "VNPAY",
        window.location.origin + "/payment/callback"
      );
      setEnrollmentData({ ...course, paymentId: paymentRes.payment.id, payment: paymentRes.payment });
      // Sau khi tạo payment, có thể poll/check trạng thái enrollment nếu cần
      // const statusRes = await learnerPaymentService.getEnrollmentStatus(paymentRes.payment.id);
      setResult({ success: true, payment: paymentRes.payment });
      setStep("result");
    } catch (err: any) {
      setError(err?.message || "Thanh toán thất bại");
      setResult({ success: false });
      setStep("result");
    } finally {
      setLoading(false);
    }
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

  console.log("DEBUG course object:", course);

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
          {error && <div className="mb-4 text-red-500 text-sm font-semibold">{error}</div>}
          {loading || userLoading ? (
            <div className="flex items-center justify-center min-h-[200px] text-slate-400">Đang xử lý...</div>
          ) : (
            <>
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
            </>
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
