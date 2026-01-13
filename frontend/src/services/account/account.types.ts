import { UserRole as _UserRole, AccountStatus as _AccountStatus, Gender as _Gender } from "../auth/auth.types";

export type UserRole = _UserRole;
export type AccountStatus = _AccountStatus;
export type Gender = _Gender;

// Enums
export type AccountActionType =
  | "APPROVE"
  | "REJECT"
  | "SUSPEND"
  | "UNLOCK"
  | "DEACTIVATE"
  | "UNKNOWN";

// Request DTOs
/** Backend: UpdateProfileRequest */
export interface UpdateProfileRequest {
  fullName?: string;
  birthDate?: string; // ISO date string (YYYY-MM-DD)
  phone?: string;
  bio?: string;
  gender?: Gender;
  specialty?: string;
  degree?: string;
}

/** Backend: AccountActionRequest */
export interface AccountActionRequest {
  reason?: string;
}

/** Backend: UpdateStatusRequest */
export interface UpdateStatusRequest {
  status: AccountStatus;
  reason?: string;
}

/** Backend: RejectRequest */
export interface RejectRequest {
  reason?: string;
}

// Response DTOs
/** Backend: AccountResponse */
export interface AccountResponse {
  accountId: number;
  username: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  lastLoginAt?: string; // ISO datetime string
  createdAt: string; // ISO datetime string
}

/** Backend: AccountProfileResponse.Profile */
export interface AccountProfile {
  studentId?: number;
  teacherId?: number;
  studentCode?: string;
  teacherCode?: string;
  fullName?: string;
  phone?: string;
  birthDate?: string; // ISO date string (YYYY-MM-DD)
  bio?: string;
  gender?: Gender;
  specialty?: string;
  degree?: string;
  approved?: boolean;
  approvedBy?: number;
  approvedAt?: string; // ISO datetime string
  rejectionReason?: string;
  createdAt?: string; // ISO datetime string
  updatedAt?: string; // ISO datetime string
}

/** Backend: AccountProfileResponse */
export interface AccountProfileResponse {
  accountId: number;
  username: string;
  email: string;
  lastLoginAt?: string; // ISO datetime string
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  profile?: AccountProfile;
}

/** Backend: UploadAvatarResponse */
export interface UploadAvatarResponse {
  avatarUrl: string;
  thumbnailUrl?: string;
}

/** Backend: AccountActionLogResponse */
export interface AccountActionLogResponse {
  id: number;
  actionType: AccountActionType;
  reason?: string;
  oldStatus?: string;
  newStatus?: string;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  performedByUsername?: string;
  ipAddress?: string;
}
