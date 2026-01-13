"use client";

import { useState, useMemo } from "react";
import { Award } from "lucide-react";
import { CertificateStats } from "@/core/components/admin/cerfificate/CertificateStats";
import { CertificateFilters } from "@/core/components/admin/cerfificate/CertificateFilters";
import { CertificateList } from "@/core/components/admin/cerfificate/CertificateList";
import { CertificateDetailPanel } from "@/core/components/admin/cerfificate/CertificateDetailPanel";
import { CertificateVerifyBox } from "@/core/components/admin/cerfificate/CertificateVerifyBox";
import { useCertificateAdmin } from "@/hooks/admin/useAdminCertificate";

export default function AdminCertificatesPage() {
  const [studentId, setStudentId] = useState<number | undefined>();
  const [courseId, setCourseId] = useState<number | undefined>();
  const [selectedCertificateId, setSelectedCertificateId] = useState<
    number | undefined
  >();

  // Load all certificates for stats (without filters)
  const { certificates: allCertificates } = useCertificateAdmin({
    autoLoad: true,
  });

  // Calculate stats
  const stats = useMemo(() => {
    const total = allCertificates?.length || 0;
    const active = allCertificates?.filter((c) => !c.isRevoked).length || 0;
    const revoked = allCertificates?.filter((c) => c.isRevoked).length || 0;

    return { total, active, revoked };
  }, [allCertificates]);

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-xl">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Certificate Management</h1>
          </div>
          <p className="text-gray-400">
            Manage, verify, and monitor all issued course certificates
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <CertificateStats
        total={stats.total}
        active={stats.active}
        revoked={stats.revoked}
      />

      {/* Filters */}
      <CertificateFilters
        studentId={studentId}
        courseId={courseId}
        onStudentIdChange={setStudentId}
        onCourseIdChange={setCourseId}
      />

      {/* Main Content - List + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Certificate List - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <CertificateList
            studentId={studentId}
            courseId={courseId}
            onSelect={setSelectedCertificateId}
            selectedId={selectedCertificateId}
          />
        </div>

        {/* Certificate Details - Takes 1 column on large screens */}
        <div className="lg:col-span-1">
          <CertificateDetailPanel certificateId={selectedCertificateId} />
        </div>
      </div>

      {/* Public Verification Box */}
      <CertificateVerifyBox />
    </div>
  );
}
