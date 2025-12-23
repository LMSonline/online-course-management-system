import { apiClient } from "@/services/core/api";

const TEACHER_PREFIX = "/api/v1/teachers";

export interface TeacherDetail {
  id: number;
  accountId: number;
  teacherCode: string;
  fullName: string;
  email: string;
  username: string;
  phone: string | null;
  birthDate: string | null;
  gender: string | null;
  bio: string | null;
  specialty: string | null;
  degree: string | null;
  avatarUrl: string | null;
  approved: boolean;
  approvedBy: number | null;
  approvedAt: string | null;
  rejectReason: string | null;
  accountStatus: string;
  role: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get current teacher profile (authenticated teacher)
 * Requires TEACHER role
 */
export async function getCurrentTeacher(): Promise<TeacherDetail> {
  const res = await apiClient(`${TEACHER_PREFIX}/me`, { method: "GET" });
  return res.data as TeacherDetail;
}

