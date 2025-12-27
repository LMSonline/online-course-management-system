"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "@/core/components/ui/Button";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

interface ProfileMissingErrorProps {
  role: "STUDENT" | "TEACHER";
  onRetry?: () => void;
}

/**
 * Error component shown when user role matches but domain profile (studentId/teacherId) is missing
 * 
 * This enforces the rule: accountId != studentId != teacherId
 * Domain IDs must be fetched separately via STUDENT_GET_ME / TEACHER_GET_ME
 */
export function ProfileMissingError({ role, onRetry }: ProfileMissingErrorProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleRetry = () => {
    // Invalidate bootstrap queries to trigger retry
    queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.AUTH_ME] });
    if (role === "STUDENT") {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.STUDENT_GET_ME] });
    } else {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.TEACHER_GET_ME] });
    }
    onRetry?.();
  };

  const profileType = role === "STUDENT" ? "student" : "teacher";
  const profileRoute = role === "STUDENT" ? "/students/me" : "/teachers/me";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {profileType.charAt(0).toUpperCase() + profileType.slice(1)} Profile Missing
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your account is authenticated, but your {profileType} profile is not available.
          Please complete your profile setup to access this page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            onClick={handleRetry}
            variant="primary"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
          <Button
            onClick={() => router.push(profileRoute)}
            variant="outline"
          >
            Go to Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

