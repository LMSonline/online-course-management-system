"use client";

import { X } from "lucide-react";

export default function Popup({ title, message, actions, onClose, open = true }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-3">{title}</h2>
        <p className="text-slate-500 dark:text-slate-300 mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          {actions}
        </div>
      </div>
    </div>
  );
}
