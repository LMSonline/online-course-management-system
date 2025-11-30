import { apiClient } from "@/services/core/api";

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
}) {
  return apiClient("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role,
      langKey: "vi",
    }),
  });
}
