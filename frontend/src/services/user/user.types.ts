import { UserRole, AccountStatus, Gender } from "../auth/auth.types";

// ===========================
// Student Types
// ===========================

export interface StudentProfile {
  studentId: number;
  studentCode: string;
  fullName?: string;
  phone?: string;
  birthDate?: string; // ISO date string (YYYY-MM-DD)
  bio?: string;
  gender?: Gender;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentDetailResponse {
  accountId: number;
  username: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  lastLoginAt?: string;
  createdAt?: string; // Add createdAt for account creation date
  profile?: StudentProfile;
}

export interface UpdateStudentRequest {
  fullName?: string;
  birthDate?: string;
  phone?: string;
  bio?: string;
  gender?: Gender;
}

export interface StudentCourseResponse {
  courseId: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  enrolledAt: string;
  progress?: number;
  status?: string;
}

export interface StudentCertificateResponse {
  certificateId: number;
  courseId: number;
  courseTitle: string;
  issuedAt: string;
  certificateUrl?: string;
}

// ===========================
// Teacher Types
// ===========================

export interface TeacherProfile {
  teacherId: number;
  teacherCode: string;
  fullName?: string;
  phone?: string;
  birthDate?: string;
  bio?: string;
  gender?: Gender;
  specialty?: string;
  degree?: string;
  approved?: boolean;
  approvedBy?: number;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeacherDetailResponse {
  accountId: number;
  username: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  lastLoginAt?: string;
  profile?: TeacherProfile;
}

export interface UpdateTeacherRequest {
  fullName?: string;
  birthDate?: string;
  phone?: string;
  bio?: string;
  gender?: Gender;
  specialty?: string;
  degree?: string;
}

export interface ApproveTeacherRequest {
  note?: string;
}

export interface RejectTeacherRequest {
  reason: string;
}

export interface TeacherStatsResponse {
  totalCourses: number;
  totalStudents: number;
  totalRevenue?: number;
  averageRating?: number;
}

export interface TeacherRevenueResponse {
  month: string;
  revenue: number;
  coursesSold: number;
}

// ===========================
// User Management Types
// ===========================

export interface AdminUserListResponse {
  accountId: number;
  username: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  fullName?: string;
  studentCode?: string;
  teacherCode?: string;
  approved?: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface UserFilterRequest {
  keyword?: string;
  role?: UserRole;
  status?: AccountStatus;
  teacherApproved?: boolean;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface UserStatsResponse {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  pendingUsers: number;
  roleStats: {
    students: number;
    teachers: number;
    admins: number;
  };
  statusStats: {
    active: number;
    pending: number;
    suspended: number;
    inactive: number;
  };
}

export interface ExportUsersRequest {
  format: "CSV" | "EXCEL";
  filters?: UserFilterRequest;
}
