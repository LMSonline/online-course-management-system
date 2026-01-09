import React from "react";
import type { StudentCertificateResponse } from "@/services/student/student.service";

export function CertificateCard({ cert }: { cert: StudentCertificateResponse }) {
  return (
    <div className="flex flex-col rounded-2xl border border-emerald-600/30 bg-gradient-to-br from-emerald-900/30 via-slate-950 to-slate-950 p-5 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-block rounded bg-emerald-600/80 px-2 py-1 text-xs font-semibold text-white">Certificate</span>
        <span className="ml-auto text-xs text-slate-400">{cert.certificateCode}</span>
      </div>
      <h3 className="text-lg font-bold text-emerald-200 mb-1 line-clamp-2">{cert.courseTitle}</h3>
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
        <span>Issued:</span>
        <span className="font-medium text-slate-200">{cert.certificateIssueDate ? new Date(cert.certificateIssueDate).toLocaleDateString() : "Unknown"}</span>
      </div>
      <a
        href={cert.certificateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-block rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
      >
        View Certificate
      </a>
    </div>
  );
}
