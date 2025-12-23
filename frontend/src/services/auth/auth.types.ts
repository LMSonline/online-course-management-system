export interface MeUser {
  accountId: number;
  username: string;
  email: string;
  fullName: string;
  status: string;
  avatarUrl: string | null;
  role: "STUDENT" | "TEACHER" | "ADMIN" | string;
}