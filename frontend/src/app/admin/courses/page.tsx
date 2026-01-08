"use client";
import { useState, useMemo } from "react";
import { Search, Clock, CheckCircle2, XCircle, Eye, AlertCircle, BookOpen, User, DollarSign, FileText } from "lucide-react";
import { useGetPendingVersions, useGetAllCourses } from "@/hooks/admin/useAdminCourses";
import { useApproveVersion, useRejectVersion } from "@/hooks/admin/useAdminCourses";
import { CourseVersionResponse } from "@/services/courses/course.types";
import { CourseResponse } from "@/services/courses/course.types";
import CourseVersionDetailModal from "@/core/components/admin/courses/CourseVersionDetailModal";
import RejectModal from "@/core/components/admin/courses/RejectModal";
import { courseVersionService } from "@/services/courses/course-version.service";

type TabType = "all" | "pending" | "published" | "rejected";

export default function AdminCoursesScreen() {
  const [selectedTab, setSelectedTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selectedVersion, setSelectedVersion] = useState<CourseVersionResponse | null>(null);
  const [rejectingVersion, setRejectingVersion] = useState<CourseVersionResponse | null>(null);
  
  const pageSize = 10;

  // Fetch courses and pending versions
  const { data: coursesData } = useGetAllCourses({ page, size: pageSize, searchQuery });
  
  const { data: versionsData, isLoading, error, refetch } = useGetPendingVersions({ 
    page, 
    size: pageSize 
  });

  const { mutate: approveVersion, isPending: isApproving } = useApproveVersion();
  const { mutate: rejectVersion, isPending: isRejecting } = useRejectVersion();

  const courses = coursesData?.items || [];
  const courseversion =versionsData?.items || []; 
  const pendingVersions = versionsData?.items || [];
  const totalItems = versionsData?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Calculate stats for heading cards
  const stats = {
    total: courses.length + pendingVersions.length,
    pending: pendingVersions.length,
    published: approveVersion.length, 
    rejected: rejectVersion.length
  };
const filteredCourses = useMemo(() => {
  if (selectedTab === "pending" || selectedTab === "rejected") return [];

  let filtered = courses;

  if (selectedTab === "published") {
    filtered = courses.filter(c => !!c.publicVersionId);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(c =>
      c.title?.toLowerCase().includes(q)
    );
  }

  return filtered;
}, [courses, selectedTab, searchQuery]);

  // Filter versions by tab
 const filteredVersions = useMemo(() => {
  if (selectedTab === "all" || selectedTab === "published") return [];

  let filtered = pendingVersions;

  if (selectedTab === "pending") {
    filtered = pendingVersions.filter(
      v => v.status === "PENDING" || !v.status
    );
  }

  if (selectedTab === "rejected") {
    filtered = pendingVersions.filter(v => v.status === "REJECTED");
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(v =>
      v.title?.toLowerCase().includes(q)
    );
  }

  return filtered;
}, [pendingVersions, selectedTab, searchQuery]);


  const handleApprove = (version: CourseVersionResponse) => {
    if (confirm(`Are you sure you want to approve version "${version.title}"?`)) {
      approveVersion(
        { courseId: version.courseId, versionId: version.id },
        {
          onSuccess: () => {
            refetch();
          }
        }
      );
    }
  };

  const handleReject = (version: CourseVersionResponse) => {
    setRejectingVersion(version);
  };

  const handleRejectSubmit = (reason: string, details: string) => {
    if (!rejectingVersion) return;

    rejectVersion(
      {
        courseId: rejectingVersion.courseId,
        versionId: rejectingVersion.id,
        reason
        // details
      },
      {
        onSuccess: () => {
          setRejectingVersion(null);
          refetch();
        }
      }
    );
  };

  const handleViewDetail = (version: CourseVersionResponse) => {
    setSelectedVersion(version);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-[#00ff00]">Course Management</h1>
          <p className="text-gray-400">
            Review and manage courses submitted by instructors
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#12182b] border border-blue-700/50 rounded-lg p-5 hover:border-blue-500 transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-900/30 rounded">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-gray-400 text-sm">Total Courses</span>
            </div>
            <p className="text-white">{stats.total}</p>
          </div>

          <div className={`bg-[#12182b] border rounded-lg p-5 hover:border-yellow-500 transition-all cursor-pointer ${
            selectedTab === "pending" ? "border-yellow-700" : "border-yellow-700/50"
          }`}
            onClick={() => setSelectedTab("pending")}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-900/30 rounded">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-gray-400 text-sm">Pending Approval</span>
            </div>
            <p className="text-yellow-400">{stats.pending}</p>
          </div>

          <div className={`bg-[#12182b] border rounded-lg p-5 hover:border-green-500 transition-all cursor-pointer ${
            selectedTab === "published" ? "border-green-700" : "border-green-700/50"
          }`}
            onClick={() => setSelectedTab("published")}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-900/30 rounded">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-gray-400 text-sm">Published</span>
            </div>
            <p className="text-green-400">{stats.published}</p>
          </div>

          <div className={`bg-[#12182b] border rounded-lg p-5 hover:border-red-500 transition-all cursor-pointer ${
            selectedTab === "rejected" ? "border-red-700" : "border-red-700/50"
          }`}
            onClick={() => setSelectedTab("rejected")}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-900/30 rounded">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-gray-400 text-sm">Rejected</span>
            </div>
            <p className="text-red-400">{stats.rejected}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by title, instructor, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12182b] border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff00]/50 focus:ring-2 focus:ring-[#00ff00]/20 transition-all"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-gray-800">
          <button
            onClick={() => setSelectedTab("all")}
            className={`px-4 py-3 transition-colors ${
              selectedTab === "all" 
                ? "text-[#00ff00] border-b-2 border-[#00ff00]" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            All Courses ({stats.total})
          </button>

          <button
            onClick={() => setSelectedTab("pending")}
            className={`px-4 py-3 transition-colors ${
              selectedTab === "pending" 
                ? "text-[#00ff00] border-b-2 border-[#00ff00]" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setSelectedTab("published")}
            className={`px-4 py-3 transition-colors ${
              selectedTab === "published" 
                ? "text-[#00ff00] border-b-2 border-[#00ff00]" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Published ({stats.published})
          </button>
          <button
            onClick={() => setSelectedTab("rejected")}
            className={`px-4 py-3 transition-colors ${
              selectedTab === "rejected" 
                ? "text-[#00ff00] border-b-2 border-[#00ff00]" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Rejected ({stats.rejected})
          </button>
        </div>

        {/* Course and version  List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-[#12182b] border border-gray-800 rounded-lg p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-gray-700 border-t-[#00ff00] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading data...</p>
            </div>
          ) : error ? (
            <div className="bg-[#12182b] border border-red-800 rounded-lg p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400">Can not load list, try again.</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="bg-[#12182b] border border-gray-800 rounded-lg p-12 text-center">
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No pending approval</p>
              <p className="text-gray-500 text-sm">All version have been handled</p>
            </div>
          ) : (
            filteredCourses.map((version) => (
              <div
                key={version.id}
                className="bg-[#12182b] border border-gray-800 rounded-xl p-6 hover:border-yellow-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-900/20"
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Left Section - Info */}
                  <div className="flex-1 space-y-4">
                    {/* Title & Version */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-900/30 rounded-lg shrink-0 mt-1">
                        <span className="text-purple-400 font-mono">v{version.versionNumber}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white mb-2 leading-tight">{version.title}</h3>
                        {version. && (
                          <p className="text-gray-400 text-sm line-clamp-2">{version.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-gray-500 text-xs">Giảng viên</p>
                          <p className="text-white text-sm">{version.approvedBy || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-gray-500 text-xs">Danh mục</p>
                          <p className="text-white text-sm">{version.title || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-gray-500 text-xs">Chapters</p>
                          <p className="text-white text-sm">{version.chapterCount || 0} chương</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-gray-500 text-xs">Giá</p>
                          <p className="text-white text-sm">${version.price || 0}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-xs rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending Approval
                      </span>
                      {version.createdAt && (
                        <span className="text-gray-500 text-xs">
                          Send at {new Date(version.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleViewDetail(version)}
                      className="px-4 py-2 bg-[#1a2237] border border-gray-700 hover:border-blue-500 text-white rounded-lg transition-all duration-200 flex items-center gap-2 group"
                    >
                      <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                      <span className="text-sm">Chi tiết</span>
                    </button>

                    <button
                      onClick={() => handleApprove(version)}
                      disabled={isApproving}
                      className="px-4 py-2 bg-green-900/30 border border-green-700 hover:bg-green-900/50 text-green-400 hover:text-green-300 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Phê duyệt</span>
                    </button>

                    <button
                      onClick={() => handleReject(version)}
                      disabled={isRejecting}
                      className="px-4 py-2 bg-red-900/30 border border-red-700 hover:bg-red-900/50 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Từ chối</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-2 bg-[#12182b] border border-gray-700 hover:border-[#00ff00] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previos page
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i;
                } else if (page < 3) {
                  pageNumber = i;
                } else if (page > totalPages - 4) {
                  pageNumber = totalPages - 5 + i;
                } else {
                  pageNumber = page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      page === pageNumber
                        ? 'bg-[#00ff00] text-black'
                        : 'bg-[#12182b] border border-gray-700 hover:border-[#00ff00] text-white'
                    }`}
                  >
                    {pageNumber + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 bg-[#12182b] border border-gray-700 hover:border-[#00ff00] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedVersion && (
        <CourseVersionDetailModal
          courseId={selectedVersion.courseId}
          versionId={selectedVersion.id}
          onClose={() => setSelectedVersion(null)}
        />
      )}

      {rejectingVersion && (
        <RejectModal
          version={rejectingVersion}
          onClose={() => setRejectingVersion(null)}
          onSubmit={handleRejectSubmit}
          isSubmitting={isRejecting}
        />
      )}
    </div>
  );
}
