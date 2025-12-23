"use client";

import { useEffect, useState } from "react";
import { getStudentCertificates } from "@/features/learner/services/learner.service";
import { getCurrentUserInfo } from "@/features/auth/services/auth.service";
import type { StudentCertificateResponse } from "@/features/learner/services/learner.service";
import { Award, Download } from "lucide-react";
import Link from "next/link";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<StudentCertificateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCertificates() {
      try {
        setLoading(true);
        const user = await getCurrentUserInfo();
        if (user.role !== "STUDENT") {
          setError("This page is only available for students");
          return;
        }
        const result = await getStudentCertificates(user.accountId, 0, 50);
        setCertificates(result.items);
      } catch (err: any) {
        console.error("Failed to load certificates:", err);
        setError(err.message || "Failed to load certificates");
      } finally {
        setLoading(false);
      }
    }
    loadCertificates();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">Loading certificates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <div className="mx-auto w-full max-w-6xl xl:max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Certificates</h1>
          <p className="text-slate-300">Certificates you've earned by completing courses</p>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No certificates yet</p>
            <p className="text-slate-500 text-sm mt-2">
              Complete courses to earn certificates
            </p>
            <Link
              href="/learner/catalog"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="rounded-2xl border border-white/10 bg-slate-950/90 p-6 hover:border-white/20 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <Award className="w-12 h-12 text-amber-400" />
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-slate-800 rounded-lg transition"
                  >
                    <Download className="w-5 h-5 text-slate-400" />
                  </a>
                </div>
                <h3 className="text-lg font-semibold mb-2">{cert.courseTitle}</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Issued on {new Date(cert.issuedAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/learner/courses/${cert.courseSlug}`}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View Course →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

