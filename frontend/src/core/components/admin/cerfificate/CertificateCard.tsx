import { Award, Copy, Shield, User, BookOpen, Calendar, Eye, Download, CheckCircle, XCircle, Clock } from "lucide-react";
import React from "react";

export interface Certificate {
  id: string;
  certificateCode: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  instructorName: string;
  issueDate: string;
  completionDate: string;
  score: number;
  status: 'valid' | 'revoked' | 'expired';
  verificationUrl: string;
  blockchainHash?: string;
}

export function CertificateCard({
  cert,
  onView,
  onCopyCode,
  onCopyHash
}: {
  cert: Certificate;
  onView: (cert: Certificate) => void;
  onCopyCode: (code: string) => void;
  onCopyHash: (hash: string) => void;
}) {
  // ...existing getStatusBadge code...
  const styles = {
    valid: 'bg-green-900/30 text-green-400 border-green-700',
    revoked: 'bg-red-900/30 text-red-400 border-red-700',
    expired: 'bg-gray-700 text-gray-300 border-gray-600'
  };
  const icons = {
    valid: <CheckCircle className="w-3 h-3" />,
    revoked: <XCircle className="w-3 h-3" />,
    expired: <Clock className="w-3 h-3" />
  };
  const getStatusBadge = (status: Certificate['status']) => (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  return (
    <div className="bg-[#1a2237] border border-gray-700 rounded-lg p-6 hover:border-[#00ff00] transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-6 h-6 text-[#00ff00]" />
            <h4 className="text-lg font-semibold text-white">{cert.courseName}</h4>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-sm text-cyan-400">{cert.certificateCode}</span>
            <button
              onClick={() => onCopyCode(cert.certificateCode)}
              className="p-1 text-gray-400 hover:text-[#00ff00] transition-colors"
              title="Copy code"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        {getStatusBadge(cert.status)}
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-gray-400">Student:</span>
          <span className="text-white font-medium">{cert.studentName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <BookOpen className="w-4 h-4 text-gray-500" />
          <span className="text-gray-400">Instructor:</span>
          <span className="text-white">{cert.instructorName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-gray-400">Issued:</span>
          <span className="text-white">{cert.issueDate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Award className="w-4 h-4 text-gray-500" />
          <span className="text-gray-400">Score:</span>
          <span className="text-[#00ff00] font-semibold">{cert.score}%</span>
        </div>
      </div>
      {cert.blockchainHash && (
        <div className="mb-4 p-3 bg-[#12182b] border border-gray-700 rounded">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-purple-400">Blockchain Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-xs text-gray-400 font-mono truncate flex-1">
              {cert.blockchainHash}
            </code>
            <button
              onClick={() => onCopyHash(cert.blockchainHash!)}
              className="p-1 text-gray-400 hover:text-purple-400 transition-colors"
              title="Copy hash"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onView(cert)}
          className="flex-1 px-4 py-2 bg-[#12182b] border border-gray-700 hover:border-[#00ff00] text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
        <button className="px-4 py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
}
