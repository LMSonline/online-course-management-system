import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppError } from "@/lib/api/api.error";
import { authService } from "@/services/auth/auth.service";
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  MeUser,
} from "@/services/auth/auth.types";
import { tokenStorage } from "@/lib/api/tokenStorage";

// Login Hook
export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<
    LoginResponse,
    AppError,
    LoginRequest & { redirectUrl?: string }
  >({
    mutationFn: ({ redirectUrl, ...loginData }) => authService.login(loginData),
    onSuccess: (data, variables) => {
      // Store tokens
      tokenStorage.setTokens(data.accessToken, data.refreshToken);

      // Store user info
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Cache user data
      queryClient.setQueryData(["currentUser"], data.user);

      toast.success("Login successful!");

      // Redirect based on role with small delay to ensure token is set
      setTimeout(() => {
        // Use redirect URL if provided, otherwise use default dashboard
        if (variables.redirectUrl) {
          router.replace(variables.redirectUrl);
        } else {
          const role = data.user.role;
          if (role === "ADMIN") {
            router.replace("/admin/dashboard");
          } else if (role === "TEACHER") {
            router.replace("/teacher/dashboard");
          } else {
            router.replace("/learner/dashboard");
          }
        }
      }, 150);
    },
    onError: (error) => {
      console.error("Login error:", error);

      // Handle specific error codes
      if (error.code === "EMAIL_NOT_VERIFIED") {
        toast.error("Please verify your email before logging in");
      } else if (error.code === "INVALID_CREDENTIALS") {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.message || "Login failed");
      }
    },
  });
};

// Register Hook
export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<RegisterResponse, AppError, RegisterRequest>({
    mutationFn: authService.register,
    onSuccess: (data) => {
      toast.success(
        "Registration successful! Please check your email to verify your account."
      );
      router.push("/verify-email");
    },
    onError: (error) => {
      console.error("Registration error:", error);

      if (error.code === "EMAIL_ALREADY_EXISTS") {
        toast.error("This email is already registered");
      } else if (error.code === "USERNAME_ALREADY_EXISTS") {
        toast.error("This username is already taken");
      } else {
        toast.error(error.message || "Registration failed");
      }
    },
  });
};

// Logout Hook
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<void, AppError>({
    mutationFn: async () => {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    },
    onSuccess: () => {
      // Clear all stored data
      tokenStorage.clear();
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }

      // Clear all queries
      queryClient.clear();

      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: (error) => {
      // Even if logout fails on server, clear local data
      tokenStorage.clear();
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      queryClient.clear();

      console.error("Logout error:", error);
      toast.error("Logged out");
      router.push("/login");
    },
  });
};

// Get Current User Hook
export const useCurrentUser = (enabled: boolean = true) => {
  return useQuery<MeUser, AppError>({
    queryKey: ["currentUser"],
    queryFn: authService.getCurrentUser,
    enabled: enabled && !!tokenStorage.getAccessToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Forgot Password Hook
export const useForgotPassword = () => {
  return useMutation<void, AppError, { email: string }>({
    mutationFn: ({ email }) => authService.forgotPassword({ email }),
    onSuccess: () => {
      toast.success("Password reset link has been sent to your email");
    },
    onError: (error) => {
      console.error("Forgot password error:", error);

      if (error.code === "USER_NOT_FOUND") {
        toast.error("No account found with this email");
      } else {
        toast.error(error.message || "Failed to send reset link");
      }
    },
  });
};

// Reset Password Hook
export const useResetPassword = () => {
  const router = useRouter();

  return useMutation<void, AppError, { token: string; newPassword: string }>({
    mutationFn: ({ token, newPassword }) =>
      authService.resetPassword({ newPassword }, token),
    onSuccess: () => {
      toast.success(
        "Password reset successful! Please login with your new password"
      );
      router.push("/login");
    },
    onError: (error) => {
      console.error("Reset password error:", error);

      if (error.code === "INVALID_TOKEN" || error.code === "TOKEN_EXPIRED") {
        toast.error("Invalid or expired reset link");
      } else {
        toast.error(error.message || "Failed to reset password");
      }
    },
  });
};

// Change Password Hook
export const useChangePassword = () => {
  return useMutation<
    void,
    AppError,
    { oldPassword: string; newPassword: string }
  >({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error) => {
      console.error("Change password error:", error);

      if (error.code === "INVALID_OLD_PASSWORD") {
        toast.error("Current password is incorrect");
      } else {
        toast.error(error.message || "Failed to change password");
      }
    },
  });
};

// Verify Email Hook
export const useVerifyEmail = () => {
  const router = useRouter();

  return useMutation<void, AppError, string>({
    mutationFn: authService.verifyEmail,
    onSuccess: () => {
      toast.success("Email verified successfully! You can now login");
      router.push("/login");
    },
    onError: (error) => {
      console.error("Verify email error:", error);

      if (error.code === "INVALID_TOKEN" || error.code === "TOKEN_EXPIRED") {
        toast.error("Invalid or expired verification link");
      } else {
        toast.error(error.message || "Failed to verify email");
      }
    },
  });
};

// Resend Verification Email Hook
export const useResendVerificationEmail = () => {
  return useMutation<void, AppError, string>({
    mutationFn: (email) => authService.resendVerificationEmail({ email }),
    onSuccess: () => {
      toast.success("Verification email has been resent");
    },
    onError: (error) => {
      console.error("Resend verification error:", error);
      toast.error(error.message || "Failed to resend verification email");
    },
  });
};
