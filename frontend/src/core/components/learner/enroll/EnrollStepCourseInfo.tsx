import React from "react";
import { ShieldCheck, BadgeCheck, InfinityIcon } from "lucide-react";

interface Props {
  course: any;
  onNext: (data: any) => void;
}

const EnrollStepCourseInfo: React.FC<Props> = ({ course, onNext }) => {
  const title = course?.title || course?.name || "Untitled course";
  const desc = course?.description || "No description available.";
  const thumb =
    course?.thumbnailUrl || course?.thumbnail || "/images/lesson_thum.png";
  const price = Number(course?.price ?? 0);
  const isPaid = price > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Review your course</h2>
        <p className="mt-1 text-sm text-slate-400">
          Confirm details before enrollment.
        </p>
      </div>

      {/* Course card */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/55 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
        <div className="flex gap-4">
          <img
            src={thumb}
            alt={title}
            className="h-24 w-24 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="text-base font-semibold text-white line-clamp-2">
              {title}
            </div>
            <div className="mt-1 text-sm text-slate-400 line-clamp-2">
              {desc}
            </div>

            <div className="mt-4 flex items-end justify-between">
              <span className="text-xs text-slate-500">Total</span>
              <span className="text-2xl font-extrabold text-white">
                {isPaid ? `${price.toLocaleString()}₫` : "Free"}
              </span>
            </div>
          </div>
        </div>

        {/* Trust row */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2">
            <InfinityIcon className="h-4 w-4 text-[var(--brand-400)]" />
            <span className="text-xs text-slate-300">Lifetime access</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2">
            <BadgeCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-slate-300">Certificate</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-slate-300" />
            <span className="text-xs text-slate-300">Secure checkout</span>
          </div>
        </div>
      </div>

      {/* Inline CTA (optional feel-good). Footer vẫn là CTA chính của step này */}
      <button
        onClick={() => onNext(course)}
        className="w-full rounded-2xl bg-[var(--brand-600)] py-3.5 text-sm font-semibold text-white hover:bg-[var(--brand-700)] transition shadow-[0_14px_40px_rgba(0,0,0,0.35)]"
      >
        {isPaid ? "Continue to payment" : "Enroll now"}
      </button>

      <p className="text-center text-[11px] text-slate-500">
        By continuing, you agree to our terms and enrollment policy.
      </p>
    </div>
  );
};

export default EnrollStepCourseInfo;
