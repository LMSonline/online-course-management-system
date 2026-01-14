// src/lib/account/account-profile.types.ts

export type Role = "ADMIN" | "STUDENT" | "TEACHER";
export type AccountStatus =
  | "PENDING_EMAIL"
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "INACTIVE"     
  | "REJECTED"
  | "SUSPENDED"
  | "DEACTIVATED";


export type Gender = "MALE" | "FEMALE" | "OTHER" | "UNKNOWN";

export interface AccountProfile {
  accountId: number;
  username: string;
  email: string;
  lastLoginAt?: string;
  role: Role;
  status: AccountStatus;
  avatarUrl?: string;
  profile?: AccountProfileDetail;
}

export interface AccountProfileDetail {
  studentId?: number;
  teacherId?: number;
  studentCode?: string;
  teacherCode?: string;
  fullName?: string;
  phone?: string;
  birthDate?: string;
  bio?: string;
  gender?: Gender;

  // Teacher only
  specialty?: string;
  degree?: string;
  approved?: boolean;
  approvedBy?: number;
  approvedAt?: string;
  rejectionReason?: string;

  // Admin only
  createdAt?: string;
  updatedAt?: string;
}

/* ===== Requests ===== */

export interface UpdateProfilePayload {
  fullName?: string;
  birthDate?: string;
  phone?: string;
  bio?: string;
  gender?: Gender;
  specialty?: string;
  degree?: string;
}

/* ===== Upload avatar ===== */

export interface UploadAvatarResponse {
  avatarUrl: string;
  thumbnailUrl?: string;
}