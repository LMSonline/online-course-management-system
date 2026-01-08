import { useState, useMemo } from "react";
import { BookOpen, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useGetAllCourses, useApproveVersion, useGetPendingVersions, useRejectVersion } from "@/hooks/admin/useAdminCourses";

interface CourseStatsCardsProps {
  selectedTab: "all" | "pending" | "published" | "rejected";
  onTabChange: (tab: "all" | "pending" | "published" | "rejected") => void;
  onStatsCalculated: (stats: {
    total: number;
    pending: number;
    published: number;
    rejected: number;
  }) => void;
}

export default function CourseStatsCards({
  selectedTab,
  onTabChange,
  onStatsCalculated,
}: CourseStatsCardsProps) {
  const pageSize = 1; // chỉ cần totalItems

  const { data: allCourses } = useGetAllCourses({ page: 0, size: pageSize });
  const { data: pendingVersions } = useGetPendingVersions({
    page: 0,
    size: pageSize,
  });

  const stats = {
    total: allCourses?.totalItems ?? 0,
    pending: pendingVersions?.totalItems ?? 0,
    published: 0, // backend chưa có
    rejected: 0,  // backend chưa có
  };

  // báo ngược lên cha
  useEffect(() => {
    onStatsCalculated(stats);
  }, [stats.total, stats.pending]);
// cấu hình cho từng card
  const cards = [
    {
      key: "all",
      label: "Total Courses",
      value: stats.total,
      icon: BookOpen,
      color: "blue",
    },
    {
      key: "pending",
      label: "Pending Approval",
      value: stats.pending,
      icon: Clock,
      color: "yellow",
    },
    {
      key: "published",
      label: "Published",
      value: stats.published,
      icon: CheckCircle2,
      color: "green",
    },
    {
      key: "rejected",
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "red",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div 
        className={`bg-[#12182b] border rounded-lg p-5 hover:border-blue-500 transition-all cursor-pointer ${
          selectedTab === "all" ? "border-blue-700" : "border-blue-700/50"
        }`}
        onClick={() => onTabChange("all")}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-900/30 rounded">
            <BookOpen className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-gray-400 text-sm">Total Courses</span>
        </div>
        <p className="text-white">{stats.total}</p>
      </div>

      <CourseVersionsLoader 
        courses={courses}
        onLoaded={(data) => {
          setCoursesWithVersions(prev => [...prev, data]);
          setLoadedCount(prev => prev + 1);
        }}
      />

      <div 
        className={`bg-[#12182b] border rounded-lg p-5 hover:border-yellow-500 transition-all cursor-pointer ${
          selectedTab === "pending" ? "border-yellow-700" : "border-yellow-700/50"
        }`}
        onClick={() => onTabChange("pending")}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-yellow-900/30 rounded">
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <span className="text-gray-400 text-sm">Pending Approval</span>
        </div>
        <p className="text-yellow-400">
          {coursesWithVersions.filter(c => c.versions.some((v: any) => v.status === "PENDING")).length}
        </p>
      </div>

      <div 
        className={`bg-[#12182b] border rounded-lg p-5 hover:border-green-500 transition-all cursor-pointer ${
          selectedTab === "published" ? "border-green-700" : "border-green-700/50"
        }`}
        onClick={() => onTabChange("published")}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-900/30 rounded">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <span className="text-gray-400 text-sm">Published</span>
        </div>
        <p className="text-green-400">
          {coursesWithVersions.filter(c => c.versions.some((v: any) => v.status === "PUBLISHED")).length}
        </p>
      </div>

      <div 
        className={`bg-[#12182b] border rounded-lg p-5 hover:border-red-500 transition-all cursor-pointer ${
          selectedTab === "rejected" ? "border-red-700" : "border-red-700/50"
        }`}
        onClick={() => onTabChange("rejected")}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-900/30 rounded">
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <span className="text-gray-400 text-sm">Rejected</span>
        </div>
        <p className="text-red-400">
          {coursesWithVersions.filter(c => c.versions.some((v: any) => v.status === "REJECTED")).length}
        </p>
      </div>
    </div>
  );
}

// Helper component to load versions for each course
function CourseVersionsLoader({ courses, onLoaded }: any) {
  courses.forEach((course: any) => {
    const { data: versions } = useGetCourseVersions(course.id);
    useMemo(() => {
      if (versions) {
        onLoaded({ courseId: course.id, versions });
      }
    }, [versions]);
  });
  return null;
}
function useEffect(arg0: () => void, arg1: number[]) {
    throw new Error("Function not implemented.");
}

