import { apiClient } from "@/services/core/api";

export async function registerUser(payload: {
  username: string;
  email: string;
  password: string;
  role: "student" | "teacher";
  langKey: string;
}) {
  return apiClient("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
