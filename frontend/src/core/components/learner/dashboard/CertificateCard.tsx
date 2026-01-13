import React, { useState } from "react";
export function CertificateCard({ cert }: { cert: any }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="flex flex-col items-start rounded-xl border border-emerald-400/30 bg-gradient-to-br from-emerald-900/40 to-slate-900/80 p-4">
      <div className="font-semibold text-base text-emerald-300 mb-1">Certificate</div>
      <div className="text-sm font-bold text-white mb-1">{cert.courseTitle}</div>
      <div className="text-xs text-slate-400 mb-2">Received: {cert.date}</div>
      <button
        onClick={() => setShowModal(true)}
        className="inline-block mt-auto rounded bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400 transition"
      >
        View Certificate
      </button>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 border border-blue-400 shadow-xl text-center relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >✕</button>
            <img
              src="/images/certificate.png"
              alt="Certificate"
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}