import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/auth/authStore";
import { mapBackendRoleToInternal } from "@/lib/auth/roleMap";
import { tokenStorage } from "@/lib/api/tokenStorage";
import { authService } from "@/services/auth/auth.service";
import { studentService } from "@/services/student/student.service";
import { teacherService } from "@/services/teacher/teacher.service";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

/**
 * Auth Bootstrap Hook
 * 
 * Implements 2-step hydration:
 * 1. AUTH_ME -> get accountId + role
 * 2. STUDENT_GET_ME / TEACHER_GET_ME -> get studentId / teacherId
 * 
 * ADMIN only needs step 1.
 */
export function useAuthBootstrap() {
  const { setAuth, setStudentId, setTeacherId, accountId, role } = useAuthStore();

  // Step 1: Get account info (AUTH_ME)
  const hasToken = !!tokenStorage.getAccessToken();
  const shouldFetchAuth = hasToken || !!accountId;

  const {
    data: accountData,
    isLoading: isLoadingAccount,
    error: accountError,
  } = useQuery({
    queryKey: [CONTRACT_KEYS.AUTH_ME],
    queryFn: authService.getCurrentUser,
    enabled: shouldFetchAuth && !accountId, // Only fetch if we don't have accountId
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Step 2a: Get student profile (if role is STUDENT)
  const shouldFetchStudent =
    (accountData?.role === "USER" || role === "STUDENT") &&
    !!accountData &&
    !useAuthStore.getState().studentId;

  const {
    data: studentData,
    isLoading: isLoadingStudent,
  } = useQuery({
    queryKey: [CONTRACT_KEYS.STUDENT_GET_ME],
    queryFn: studentService.getMe,
    enabled: shouldFetchStudent,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Step 2b: Get teacher profile (if role is TEACHER)
  const shouldFetchTeacher =
    (accountData?.role === "CREATOR" || role === "TEACHER") &&
    !!accountData &&
    !useAuthStore.getState().teacherId;

  const {
    data: teacherData,
    isLoading: isLoadingTeacher,
  } = useQuery({
    queryKey: [CONTRACT_KEYS.TEACHER_GET_ME],
    queryFn: teacherService.getMe,
    enabled: shouldFetchTeacher,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Update auth store when account data arrives
  useEffect(() => {
    if (accountData) {
      const internalRole = mapBackendRoleToInternal(accountData.role);
      setAuth({
        accountId: accountData.accountId,
        role: internalRole,
        email: accountData.email,
        fullName: accountData.fullName ?? null,
        username: accountData.username,
        avatarUrl: accountData.avatarUrl ?? null,
      });
    }
  }, [accountData, setAuth]);

  // Update studentId when student data arrives
  useEffect(() => {
    if (studentData) {
      setStudentId(studentData.id);
    }
  }, [studentData, setStudentId]);

  // Update teacherId when teacher data arrives
  useEffect(() => {
    if (teacherData) {
      setTeacherId(teacherData.id);
    }
  }, [teacherData, setTeacherId]);

  // Determine if bootstrap is ready
  const isLoading =
    isLoadingAccount || isLoadingStudent || isLoadingTeacher;

  const isReady = (() => {
    if (!accountData) return false;
    const currentRole = mapBackendRoleToInternal(accountData.role);
    
    if (currentRole === "ADMIN") {
      return true; // Admin only needs accountId
    }
    
    if (currentRole === "STUDENT") {
      return !!studentData; // Student needs studentId
    }
    
    if (currentRole === "TEACHER") {
      return !!teacherData; // Teacher needs teacherId
    }
    
    return false;
  })();

  return {
    isLoading,
    isReady,
    error: accountError,
    accountData,
    studentData,
    teacherData,
  };
}

