/**
 * Demo Mode Mock Data
 * 
 * Provides mock data for protected endpoints when DEMO_MODE is enabled.
 * All data shapes match the actual API response types.
 */

import type { MeUser } from "@/services/auth/auth.types";
import type { AccountProfileResponse } from "@/services/account/account.types";
import type { StudentProfile } from "@/services/student/student.service";
import type { TeacherProfile, TeacherStats, TeacherRevenue } from "@/services/teacher/teacher.service";
import type { NotificationResponse } from "@/services/community/community.types";
import type { PageResponse } from "@/lib/api/api.types";

// Demo Account (AUTH_ME)
export const DEMO_ACCOUNT: MeUser = {
  accountId: 1,
  username: "demo_student",
  email: "demo@example.com",
  fullName: "Demo Student",
  status: "ACTIVE",
  avatarUrl: undefined,
  role: "STUDENT",
  birthday: undefined,
  bio: undefined,
  gender: undefined,
  lastLoginAt: new Date().toISOString(),
  profile: {
    studentId: 1,
    teacherId: undefined,
  },
};

// Demo Account Profile (ACCOUNT_GET_PROFILE)
export const DEMO_ACCOUNT_PROFILE: AccountProfileResponse = {
  accountId: 1,
  username: "demo_student",
  email: "demo@example.com",
  lastLoginAt: new Date().toISOString(),
  role: "STUDENT",
  status: "ACTIVE",
  avatarUrl: undefined,
  profile: {
    studentId: 1,
    studentCode: "STU001",
    fullName: "Demo Student",
    phone: undefined,
    birthDate: undefined,
    bio: "This is a demo account for UI testing.",
    gender: undefined,
    specialty: undefined,
    degree: undefined,
    approved: true,
    approvedBy: undefined,
    approvedAt: undefined,
    rejectionReason: undefined,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

// Demo Student Profile (STUDENT_GET_ME)
export const DEMO_STUDENT: StudentProfile = {
  id: 1,
  accountId: 1,
  fullName: "Demo Student",
  bio: "This is a demo student account for UI testing.",
  avatarUrl: undefined,
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
};

// Demo Teacher Profile (TEACHER_GET_ME)
export const DEMO_TEACHER: TeacherProfile = {
  id: 1,
  accountId: 2,
  fullName: "Demo Teacher",
  bio: "This is a demo teacher account for UI testing.",
  headline: "Senior Instructor",
  avatarUrl: undefined,
  createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
};

// Demo Teacher Stats (TEACHER_GET_STATS)
export const DEMO_TEACHER_STATS: TeacherStats = {
  totalCourses: 5,
  totalStudents: 120,
  avgRating: 4.8,
  totalReviews: 45,
  completionRate: 85.5,
  activeEnrollments: 95,
};

// Demo Teacher Revenue (TEACHER_GET_REVENUE)
export const DEMO_TEACHER_REVENUE: TeacherRevenue = {
  totalRevenue: 12500.0,
  revenueByCourse: [
    { courseId: 1, courseTitle: "Introduction to Web Development", revenue: 5000.0 },
    { courseId: 2, courseTitle: "Advanced React Patterns", revenue: 4500.0 },
    { courseId: 3, courseTitle: "Full Stack Development", revenue: 3000.0 },
  ],
  revenueByMonth: [
    { month: "2025-01", revenue: 4200.0 },
    { month: "2025-02", revenue: 3800.0 },
    { month: "2025-03", revenue: 4500.0 },
  ],
  currency: "USD",
};

// Demo Enrollments (ENROLLMENT_GET_STUDENT_LIST)
export const DEMO_ENROLLMENTS = [
  {
    id: 1,
    studentId: 1,
    studentName: "Demo Student",
    studentEmail: "demo@example.com",
    courseId: 1,
    courseTitle: "Introduction to Web Development",
    courseVersionId: 1,
    versionNumber: 1,
    status: "ENROLLED" as const,
    enrolledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    startAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    completionPercentage: 45.5,
    averageScore: 8.2,
    certificateIssued: false,
    completedAt: undefined,
    remainingDays: 50,
    isActive: true,
    canTakeFinalExam: false,
  },
  {
    id: 2,
    studentId: 1,
    studentName: "Demo Student",
    studentEmail: "demo@example.com",
    courseId: 2,
    courseTitle: "Advanced React Patterns",
    courseVersionId: 1,
    versionNumber: 1,
    status: "ENROLLED" as const,
    enrolledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    startAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString(),
    completionPercentage: 12.0,
    averageScore: undefined,
    certificateIssued: false,
    completedAt: undefined,
    remainingDays: 55,
    isActive: true,
    canTakeFinalExam: false,
  },
  {
    id: 3,
    studentId: 1,
    studentName: "Demo Student",
    studentEmail: "demo@example.com",
    courseId: 3,
    courseTitle: "Full Stack Development",
    courseVersionId: 1,
    versionNumber: 1,
    status: "COMPLETED" as const,
    enrolledAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    startAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    completionPercentage: 100.0,
    averageScore: 9.5,
    certificateIssued: true,
    completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    remainingDays: 0,
    isActive: false,
    canTakeFinalExam: false,
  },
];

// Demo Notifications (NOTIFICATION_GET_LIST)
export const DEMO_NOTIFICATIONS: NotificationResponse[] = [
  {
    id: 1,
    type: "COURSE_UPDATE",
    title: "Course Updated",
    message: "Introduction to Web Development has been updated with new content.",
    read: false,
    accountId: 1,
    relatedEntityType: "COURSE",
    relatedEntityId: 1,
    actionUrl: "/courses/introduction-to-web-development",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    readAt: undefined,
  },
  {
    id: 2,
    type: "NEW_ASSIGNMENT",
    title: "New Assignment Available",
    message: "A new assignment has been added to Advanced React Patterns.",
    read: false,
    accountId: 1,
    relatedEntityType: "COURSE",
    relatedEntityId: 2,
    actionUrl: "/learn/advanced-react-patterns",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    readAt: undefined,
  },
  {
    id: 3,
    type: "ASSIGNMENT_GRADED",
    title: "Assignment Graded",
    message: "Your assignment in Full Stack Development has been graded.",
    read: true,
    accountId: 1,
    relatedEntityType: "COURSE",
    relatedEntityId: 3,
    actionUrl: "/learn/full-stack-development",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    readAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    type: "CERTIFICATE_ISSUED",
    title: "Certificate Issued",
    message: "Congratulations! You've completed Full Stack Development and earned a certificate.",
    read: true,
    accountId: 1,
    relatedEntityType: "COURSE",
    relatedEntityId: 3,
    actionUrl: "/certificates/3",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    readAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// // Helper to create PageResponse
// export function createDemoPageResponse<T>(items: T[], page: number = 0, size: number = 20): PageResponse<T> {
//   const totalElements = items.length;
//   const totalPages = Math.ceil(totalElements / size);
//   const start = page * size;
//   const end = start + size;
//   const content = items.slice(start, end);

//   return {
//     content,
//     page,
//     size,
//     totalElements,
//     totalPages,
//     first: page === 0,
//     last: page >= totalPages - 1,
//   };
// }

