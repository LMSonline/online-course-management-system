import { XCircle, CheckCircle, Shield, Download, QrCode, Copy } from "lucide-react";
import { Certificate } from "./CertificateCard";
import React from "react";

export function CertificateDetailModal({
  certificate,
  onClose
}: {
  certificate: Certificate;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#12182b] border border-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Certificate Details</h3>
              <p className="font-mono text-sm text-cyan-400">{certificate.certificateCode}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-green-900/10 border border-green-700 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <p className="font-semibold text-white">Certificate Status</p>
                <p className="text-sm text-gray-400">This certificate is valid and verified</p>
              </div>
            </div>
            {/* {getStatusBadge(selectedCertificate.status)} */}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Student Name</p>
              <p className="text-white font-medium">{certificate.studentName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <p className="text-white font-medium">{certificate.studentEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Course Name</p>
              <p className="text-white font-medium">{certificate.courseName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Instructor</p>
              <p className="text-white font-medium">{certificate.instructorName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Completion Date</p>
              <p className="text-white font-medium">{certificate.completionDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Issue Date</p>
              <p className="text-white font-medium">{certificate.issueDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Final Score</p>
              <p className="text-2xl font-bold text-[#00ff00]">{certificate.score}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Verification URL</p>
              <a href={certificate.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline text-sm flex items-center gap-1">
                View Public Page
                {/* <ExternalLink className="w-3 h-3" /> */}
              </a>
            </div>
          </div>

          {/* Blockchain Verification */}
          {certificate.blockchainHash && (
            <div className="p-4 bg-purple-900/10 border border-purple-700 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-purple-400" />
                <h4 className="font-semibold text-white">Blockchain Verification</h4>
              </div>
              <p className="text-sm text-gray-400 mb-2">This certificate is secured on the blockchain</p>
              <div className="flex items-center gap-2 p-3 bg-[#1a2237] rounded">
                <code className="text-xs text-purple-400 font-mono flex-1 break-all">
                  {certificate.blockchainHash}
                </code>
                <button
                  onClick={() => { }}
                  className="p-2 text-purple-400 hover:bg-purple-900/20 rounded transition-colors"
                  title="Copy hash"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
            <button className="flex-1 px-4 py-3 bg-[#00ff00] hover:bg-[#00dd00] text-black rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download Certificate
            </button>
            <button className="flex-1 px-4 py-3 bg-[#1a2237] border border-gray-700 hover:border-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
              <QrCode className="w-4 h-4" />
              Generate QR Code
            </button>
            {certificate.status === 'valid' && (
              <button className="px-4 py-3 bg-red-900/20 border border-red-700 text-red-400 rounded-lg hover:bg-red-900/30 transition-colors">
                Revoke
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}