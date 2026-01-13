"use client";

import { Award, CheckCircle, XCircle, Calendar, Trophy } from "lucide-react";
import { useCertificateAdmin } from "@/hooks/admin/useAdminCertificate";

interface Props {
  studentId?: number;
  courseId?: number;
  onSelect: (id: number) => void;
  selectedId?: number;
}

export function CertificateList({ studentId, courseId, onSelect, selectedId }: Props) {
  const { certificates, loading, error } = useCertificateAdmin({
    studentId,
    courseId,
    autoLoad: true,
  });

  if (loading) {
    return (
      <div className="bg-[#1a2332] border border-gray-700 rounded-xl p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-emerald-400 rounded-full animate-spin" />
          <span className="text-gray-400">Loading certificates...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1a2332] border border-rose-500/30 rounded-xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-rose-400" />
          </div>
          <p className="text-rose-400 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!certificates || certificates.length === 0) {
    return (
      <div className="bg-[#1a2332] border border-gray-700 rounded-xl p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-700/30 border-2 border-gray-700 flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400 font-medium">No certificates found</p>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a2332] border border-gray-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700 bg-[#141d2b]">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          <h3 className="text-white font-semibold">Certificates List</h3>
          <span className="ml-auto px-3 py-1 bg-gray-700 rounded-full text-gray-300 text-sm font-medium">
            {certificates.length} total
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 bg-[#141d2b]/50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Issued
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {certificates.map((cert) => (
              <tr
                key={cert.id}
                onClick={() => onSelect(cert.id)}
                className={`cursor-pointer transition-colors ${
                  selectedId === cert.id
                    ? "bg-emerald-500/10 hover:bg-emerald-500/15"
                    : "hover:bg-gray-700/30"
                }`}
              >
                {/* Code */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500/10 rounded">
                      <Award className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-white font-mono text-sm font-medium">
                      {cert.code}
                    </span>
                  </div>
                </td>

                {/* Student */}
                <td className="px-6 py-4">
                  <div>
                    <p className="text-white font-medium">{cert.studentName}</p>
                    {/* <p className="text-gray-500 text-xs">{cert.studentEmail}</p> */}
                  </div>
                </td>

                {/* Course */}
                <td className="px-6 py-4">
                  <p className="text-gray-300 text-sm">{cert.courseTitle}</p>
                </td>

                {/* Score */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-semibold">{cert.finalScore}</span>
                  </div>
                </td>

                {/* Issued Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {cert.isRevoked ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium">
                      <XCircle className="w-3.5 h-3.5" />
                      Revoked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Active
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
