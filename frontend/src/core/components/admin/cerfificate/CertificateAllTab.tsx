import { Calendar, Filter, Download } from "lucide-react";
import { CertificateCard, Certificate } from "./CertificateCard";
import React from "react";

export function CertificateAllTab({
  certificates,
  setSelectedCertificate
}: {
  certificates: Certificate[];
  setSelectedCertificate: (c: Certificate) => void;
}) {
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Certificate code copied to clipboard!');
  };
  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    alert('Blockchain hash copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select className="bg-[#12182b] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00ff00]">
            <option value="all">All Status</option>
            <option value="valid">Valid</option>
            <option value="revoked">Revoked</option>
            <option value="expired">Expired</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#12182b] border border-gray-700 hover:border-[#00ff00] text-white rounded-lg transition-colors">
            <Calendar className="w-4 h-4" />
            Date Range
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#12182b] border border-gray-700 hover:border-[#00ff00] text-white rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
      {/* Certificates Grid */}
      <div className="grid grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id}>
            <CertificateCard
              cert={cert}
              onView={setSelectedCertificate}
              onCopyCode={handleCopyCode}
              onCopyHash={handleCopyHash}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
