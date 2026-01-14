'use client';
import { useState } from "react";
import { X, BookOpen, User, FileText, DollarSign, Calendar, Hash, Star, MessageSquare, TrendingUp } from "lucide-react";
import { useGetVersionDetail } from "@/hooks/admin/useAdminCourses";
import { useCourseReviews } from "@/hooks/admin/useCourseReviews";
import { useAdminCourseReviews } from "@/hooks/admin/useAdminCourses";
interface CourseVersionDetailModalProps {
  isOpen: boolean;
  courseId: number;
  versionId: number;
  onClose: () => void;
}

type TabType = "info" | "reviews" | "rating";

export function CourseVersionDetailModal({ isOpen, courseId, versionId, onClose }: CourseVersionDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("info");

  const { data: version, isLoading, isError } = useGetVersionDetail(courseId, versionId);
  const { data: reviewsData, isLoading: reviewsLoading } = useCourseReviews(version?.courseId, 0, 10);
  // const { data: ratingSummary, isLoading: ratingLoading } = useGetRatingSummary(version?.courseId);

  const reviews = reviewsData?.items || [];
  const totalReviews = reviewsData?.totalItems || 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#12182b] border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-900/30 rounded-lg">
              <span className="text-purple-400 font-mono">
                {isLoading ? "..." : version ? `v${version.versionNumber}` : "N/A"}
              </span>
            </div>
            <div>
              <h2 className="text-white">
                {isLoading ? "Đang tải..." : version?.title || "Không có tiêu đề"}
              </h2>
              <p className="text-gray-400 text-sm">{version?.approvedBy || "Nguyen Van A"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 px-6 border-b border-gray-800">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-4 py-3 transition-colors flex items-center gap-2 ${
              activeTab === "info"
                ? "text-[#00ff00] border-b-2 border-[#00ff00]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Thông tin
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-3 transition-colors flex items-center gap-2 ${
              activeTab === "reviews"
                ? "text-[#00ff00] border-b-2 border-[#00ff00]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Reviews ({totalReviews})
          </button>
          <button
            onClick={() => setActiveTab("rating")}
            className={`px-4 py-3 transition-colors flex items-center gap-2 ${
              activeTab === "rating"
                ? "text-[#00ff00] border-b-2 border-[#00ff00]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Rating Summary
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-700 border-t-[#00ff00] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Đang tải dữ liệu phiên bản khoá học...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-red-400">Không thể tải dữ liệu. Vui lòng thử lại.</p>
            </div>
          ) : version && (
            <>
              {activeTab === "info" && (
                <div className="space-y-6">
                  {/* Short Description */}
                  {version.description && (
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Mô tả ngắn</label>
                      <p className="text-gray-300 text-sm leading-relaxed">{version.description}</p>
                    </div>
                  )}

                  {/* Full Description */}
                  {version.description && (
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Mô tả đầy đủ</label>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{version.description}</p>
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0d111f] border border-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <label className="text-gray-400 text-sm">Giảng viên</label>
                      </div>
                      <p className="text-white">{version.approvedBy || 'Nguyen Van A'}</p>
                    </div>

                    <div className="bg-[#0d111f] border border-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <label className="text-gray-400 text-sm">Danh mục</label>
                      </div>
                      <p className="text-white">{version.title || 'N/A'}</p>
                    </div>

                    <div className="bg-[#0d111f] border border-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <label className="text-gray-400 text-sm">Số chương</label>
                      </div>
                      <p className="text-white">{version.chapterCount || 0} chương</p>
                    </div>

                    <div className="bg-[#0d111f] border border-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <label className="text-gray-400 text-sm">Giá</label>
                      </div>
                      <p className="text-white">${version.price || 0}</p>
                    </div>

                    <div className="bg-[#0d111f] border border-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Hash className="w-4 h-4 text-gray-500" />
                        <label className="text-gray-400 text-sm">Course ID</label>
                      </div>
                      <p className="text-white font-mono">{version.courseId}</p>
                    </div>

                    {version.createdAt && (
                      <div className="bg-[#0d111f] border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <label className="text-gray-400 text-sm">Ngày tạo</label>
                        </div>
                        <p className="text-white">{new Date(version.createdAt).toLocaleString('vi-VN')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {reviewsLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block w-8 h-8 border-4 border-gray-700 border-t-[#00ff00] rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-400">Đang tải reviews...</p>
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Chưa có review nào</p>
                    </div>
                  ) : (
                    reviews.map((review: any) => (
                      <div key={review.id} className="bg-[#0d111f] border border-gray-800 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-white font-medium">{review.userName}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-600"
                                  }`}
                                />
                              ))}
                              <span className="text-gray-400 text-sm ml-2">{review.rating}/5</span>
                            </div>
                          </div>
                          <span className="text-gray-500 text-xs">
                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              )}   
            
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[#1a2237] border border-gray-700 hover:border-[#00ff00] text-white rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
