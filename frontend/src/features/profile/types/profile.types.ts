/**
 * Profile types
 * Extended from profile.service.ts for consistency
 */

export interface AccountProfileDetails {
  fullName?: string;
  bio?: string;
  birthday?: string;
  gender?: string;
}

export interface AccountProfileResponse {
  accountId: number;
  username: string;
  email: string;
  status: string;
  avatarUrl: string | null;
  role: "STUDENT" | "TEACHER" | "ADMIN" | string;
  lastLoginAt?: string;
  // Flattened helpers for existing UI usage
  fullName?: string;
  bio?: string;
  birthday?: string;
  gender?: string;
  profile?: AccountProfileDetails;
}

export interface UpdateProfileRequest {
  fullName?: string;
  bio?: string;
  birthday?: string;
  gender?: string;
  // Frontend-only fields (not in backend yet)
  firstName?: string;
  lastName?: string;
  headline?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
  twitter?: string;
  language?: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}

export interface PrivacySettings {
  showProfilePublic: boolean;
  showCoursesOnProfile: boolean;
}

