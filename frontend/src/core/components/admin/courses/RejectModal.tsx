import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { CourseVersionResponse } from "@/services/courses/course.types";

interface RejectModalProps {
  version: CourseVersionResponse;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
  isSubmitting: boolean;
}

const REJECT_REASONS = [
  "Nội dung không phù hợp",
  "Chất lượng kém",
  "Vi phạm quy định",
  "Thông tin không chính xác",
  "Thiếu nội dung quan trọng",
  "Lý do khác"
];

export default function RejectModal({ version, onClose, onSubmit, isSubmitting }: RejectModalProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      setError("Vui lòng chọn lý do từ chối");
      return;
    }
    
    if (!details.trim()) {
      setError("Vui lòng nhập chi tiết lý do từ chối");
      return;
    }

    setError("");
    onSubmit(reason, details);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#12182b] border border-red-800 rounded-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-900/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-white">Từ chối phiên bản</h2>
              <p className="text-gray-400 text-sm">Nhập lý do từ chối phê duyệt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Version Info */}
          <div className="bg-[#0d111f] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-900/30 rounded-lg">
                <span className="text-purple-400 font-mono text-sm">v{version.versionNumber}</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{version.title}</p>
                <p className="text-gray-400 text-sm">by {version.approvedBy}</p>
              </div>
            </div>
          </div>

          {/* Reason Select */}
          <div>
            <label className="text-gray-300 text-sm mb-2 block">
              Lý do từ chối <span className="text-red-400">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#0d111f] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              disabled={isSubmitting}
            >
              <option value="">Chọn lý do...</option>
              {REJECT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Details Textarea */}
          <div>
            <label className="text-gray-300 text-sm mb-2 block">
              Chi tiết <span className="text-red-400">*</span>
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Nhập chi tiết lý do từ chối để giảng viên có thể cải thiện..."
              rows={5}
              className="w-full bg-[#0d111f] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
              disabled={isSubmitting}
            />
            <p className="text-gray-500 text-xs mt-2">
              Tối thiểu 10 ký tự. Hãy cung cấp thông tin chi tiết để giúp giảng viên cải thiện.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-[#1a2237] border border-gray-700 hover:border-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-red-900/30 border border-red-700 hover:bg-red-900/50 text-red-400 hover:text-red-300 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                  Đang xử lý...
                </span>
              ) : (
                "Xác nhận từ chối"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
