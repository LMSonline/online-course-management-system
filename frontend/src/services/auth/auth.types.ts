export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";
export type AccountStatus = "ACTIVE" | "PENDING_APPROVAL" |"PENDING_EMAIL" | "SUSPENDED" | "INACTIVE";
export type Gender = "MALE" | "FEMALE" | "OTHER" | "UNKNOWN";

//Request
/** Backend: ReqLoginDTO */
export interface LoginRequest {
  login: string;
  password: string;
  deviceInfo?: string;
  ipAddress?: string;
}

/** Backend: RegisterRequest */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  langKey?: string;
}

/** Backend: ReqRefreshTokenDTO */
export interface RefreshTokenRequest {
  refreshToken: string;
  deviceInfo?: string;
  ipAddress?: string;
}

/** Backend: ChangePasswordDTO */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

/** Backend: ForgotPasswordDTO */
export interface ForgotPasswordRequest {
  email: string;
}

/** Backend: ResetPasswordDTO */
export interface ResetPasswordRequest {
  newPassword: string;
}

/** Backend: ResendVerifyEmailRequest */
export interface ResendVerifyEmailRequest {
  email: string;
}

//Response
export interface StudentProfile {
  studentId: number;
  studentCode: string;
  fullName: string;
  phone?: string | null;
  birthDate?: string | null;
  bio?: string | null;
  gender?: string | null;
}

export interface MeUser {
  accountId: number;
  username: string;
  email: string;
  fullName?: string;
  status: AccountStatus;
  avatarUrl?: string;
  role: UserRole;
  birthday?: string;
  bio?: string;
  gender?: Gender;
  lastLoginAt?: string;
  profile?: StudentProfile;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  createdAt: string;
  langKey?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  user: LoginUserInfo;
}

export interface LoginUserInfo {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  fullName?: string;
  avatarUrl?: string;
  langKey?: string;
}

export interface UserInsideToken {
  accountId: number;
  username: string;
  email: string;
  role: UserRole;
}
