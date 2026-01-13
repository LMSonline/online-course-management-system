// Chuẩn hóa theo AccountProfileResponse backend
import type { Gender, UserRole, AccountStatus } from './account.types';

// Re-export để các nơi khác dùng chung
export type { Gender, UserRole, AccountStatus };

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

export interface UploadAvatarResponse {
  avatarUrl: string;
  thumbnailUrl?: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  birthDate?: string;
  bio?: string;
  gender?: Gender;
  specialty?: string;
  degree?: string;
}
