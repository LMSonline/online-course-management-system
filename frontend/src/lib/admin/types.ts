// src/lib/admin/types.ts

// ==== DASHBOARD OVERVIEW ====

export type AdminOverview = {
  totalUsers: number;
  learners: number;
  instructors: number;
  activeCourses: number;
  pendingCourses: number;
  monthlyRevenue: number;
  systemHealth: "Healthy" | "Degraded" | "Down";
};

// Trend theo tháng cho dashboard & reports
export type MonthlyMetricPoint = {
  month: string;       // e.g. "Nov"
  revenue: number;     // $
  newUsers: number;    // số user đăng ký mới
  activeLearners: number; // learner có hoạt động
};

// ==== USER MANAGEMENT ====

export type AdminUserRole = "Learner" | "Instructor" | "Admin";

export type AdminUserStatus = "Active" | "Pending" | "Suspended";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  createdAt: string;
  lastActive: string;
};

// ==== COURSE APPROVAL ====

export type CourseApprovalStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "NeedsChanges";

export type CourseApprovalItem = {
  id: string;
  title: string;
  instructorName: string;
  instructorEmail: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  submittedAt: string;
  status: CourseApprovalStatus;
  durationLabel: string; // "8h 30m"
  lecturesCount: number;
  price: number;
};

// ==== REPORTS / STATISTICS ====

export type SystemReportSummary = {
  totalRevenueAllTime: number;
  totalEnrollments: number;
  avgCompletionRate: number; // %
  avgCourseRating: number;   // 0–5
};

export type InstructorPerformanceSummary = {
  id: string;
  name: string;
  courses: number;
  avgRating: number;
  completionRate: number;
  learners: number;
};

// ==== ROOT MOCK DATA ====

export type AdminMockData = {
  overview: AdminOverview;
  monthly: MonthlyMetricPoint[];
  users: AdminUser[];
  courseApprovals: CourseApprovalItem[];
  reportsSummary: SystemReportSummary;
  instructorPerformance: InstructorPerformanceSummary[];
};

export const ADMIN_MOCK_DATA: AdminMockData = {
  overview: {
    totalUsers: 12450,
    learners: 11230,
    instructors: 210,
    activeCourses: 186,
    pendingCourses: 9,
    monthlyRevenue: 18452.75,
    systemHealth: "Healthy",
  },
  monthly: [
    { month: "Nov", revenue: 12000, newUsers: 740, activeLearners: 3100 },
    { month: "Dec", revenue: 14500, newUsers: 910, activeLearners: 3400 },
    { month: "Jan", revenue: 16220, newUsers: 980, activeLearners: 3650 },
    { month: "Feb", revenue: 17110, newUsers: 1020, activeLearners: 3780 },
    { month: "Mar", revenue: 18452.75, newUsers: 1105, activeLearners: 3920 },
  ],
  users: [
    {
      id: "u1",
      name: "Han Vo",
      email: "han.vo@example.com",
      role: "Instructor",
      status: "Active",
      createdAt: "2024-02-10",
      lastActive: "2025-03-18 10:12",
    },
    {
      id: "u2",
      name: "Minh Tran",
      email: "minh.tran@example.com",
      role: "Learner",
      status: "Active",
      createdAt: "2024-09-03",
      lastActive: "2025-03-18 09:43",
    },
    {
      id: "u3",
      name: "Thao Nguyen",
      email: "thao.nguyen@example.com",
      role: "Instructor",
      status: "Pending",
      createdAt: "2025-03-15",
      lastActive: "—",
    },
    {
      id: "u4",
      name: "Admin System",
      email: "admin@example.com",
      role: "Admin",
      status: "Active",
      createdAt: "2023-11-01",
      lastActive: "2025-03-18 08:20",
    },
    {
      id: "u5",
      name: "Khoa Le",
      email: "khoa.le@example.com",
      role: "Learner",
      status: "Suspended",
      createdAt: "2024-04-18",
      lastActive: "2025-02-28 21:17",
    },
  ],
  courseApprovals: [
    {
      id: "ca1",
      title: "Building Microservices with NestJS",
      instructorName: "Han Vo",
      instructorEmail: "han.vo@example.com",
      category: "Backend",
      level: "Intermediate",
      submittedAt: "2025-03-16 20:41",
      status: "Pending",
      durationLabel: "9h 15m",
      lecturesCount: 72,
      price: 19.99,
    },
    {
      id: "ca2",
      title: "Introduction to UX Design for Developers",
      instructorName: "Linh Tran",
      instructorEmail: "linh.tran@example.com",
      category: "Design",
      level: "Beginner",
      submittedAt: "2025-03-14 11:05",
      status: "NeedsChanges",
      durationLabel: "5h 40m",
      lecturesCount: 48,
      price: 14.99,
    },
    {
      id: "ca3",
      title: "Advanced TypeScript Patterns",
      instructorName: "Khoa Nguyen",
      instructorEmail: "khoa.nguyen@example.com",
      category: "Programming Languages",
      level: "Advanced",
      submittedAt: "2025-03-10 09:20",
      status: "Approved",
      durationLabel: "7h 05m",
      lecturesCount: 55,
      price: 24.99,
    },
  ],
  reportsSummary: {
    totalRevenueAllTime: 245_210.5,
    totalEnrollments: 58_420,
    avgCompletionRate: 64.2,
    avgCourseRating: 4.63,
  },
  instructorPerformance: [
    {
      id: "t1",
      name: "Han Vo",
      courses: 5,
      avgRating: 4.8,
      completionRate: 71,
      learners: 8421,
    },
    {
      id: "t2",
      name: "Linh Tran",
      courses: 3,
      avgRating: 4.6,
      completionRate: 61,
      learners: 5210,
    },
    {
      id: "t3",
      name: "Khoa Nguyen",
      courses: 2,
      avgRating: 4.7,
      completionRate: 68,
      learners: 3180,
    },
  ],
};
