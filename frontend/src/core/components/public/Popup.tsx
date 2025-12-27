"use client";

import Image from "next/image";
import { X } from "lucide-react";

export type PopupType = "success" | "error" | "warning" | "info";

interface PopupProps {
  title?: string;
  message?: string;
  actions?: React.ReactNode;
  onClose?: () => void;
  open?: boolean;
  type?: PopupType;
}

export default function Popup({
  title = "",
  message = "",
  actions = null,
  onClose = () => { },
  open = true,
  type = "info",
}: PopupProps) {
  if (!open) return null;

  const iconBg: Record<PopupType, string> = {
    success: "bg-green-700/20 text-green-400 border-green-600/40",
    error: "bg-green-700/20 text-green-400 border-green-600/40",
    warning: "bg-green-700/20 text-green-400 border-green-600/40",
    info: "bg-green-700/20 text-green-400 border-green-600/40",
  };

  const iconChar: Record<PopupType, string> = {
    success: "✓",
    error: "✕",
    warning: "!",
    info: "i",
  };

  return (
    <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div
        className="
          w-full max-w-lg bg-[#0d1524] text-white 
          rounded-2xl shadow-xl border border-white/10 p-7
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Image
              src="/images/lms_logo.png"
              alt="LMS Logo"
              width={50}
              height={50}
              className="rounded-md"
            />
            <h2 className="text-lg font-semibold tracking-wide">{title}</h2>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* ICON + MESSAGE (same row) */}
        <div className="flex items-start gap-4 mb-8 mt-2">
          {/* Icon */}
          <div
            className={`
              w-10 h-10 rounded-full flex-shrink-0
              flex items-center justify-center text-lg font-bold
              border ${iconBg[type]}
            `}
          >
            {iconChar[type]}
          </div>

          {/* Message */}
          <p className="text-slate-300 leading-relaxed text-[15px] pt-1">
            {message}
          </p>
        </div>

        {/* ACTIONS (aligned right) */}
        <div className="flex justify-end">
          {actions || (
            <button
              onClick={onClose}
              className="
                px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 
                text-white font-medium transition
              "
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
