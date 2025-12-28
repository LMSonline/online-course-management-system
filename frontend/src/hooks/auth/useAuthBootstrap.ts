import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/auth/authStore";
import { mapBackendRoleToInternal } from "@/lib/auth/roleMap";
import { tokenStorage } from "@/lib/api/tokenStorage";
import { authService } from "@/services/auth/auth.service";
import { studentService } from "@/services/student/student.service";
import { teacherService } from "@/services/teacher/teacher.service";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";
import { DEMO_MODE } from "@/lib/env";

/**
 * Auth Bootstrap Hook
 * 
 * Implements 2-step hydration:
 * 1. AUTH_ME (/accounts/me) -> get accountId + role + profile.studentId/teacherId (if available)
 * 2. STUDENT_GET_ME / TEACHER_GET_ME -> get studentId / teacherId (only if not in profile)
 * 
 * ADMIN only needs step 1.
 * 
 * IMPORTANT: If /accounts/me returns profile.studentId, we skip /students/me call.
 */
export function useAuthBootstrap() {
  const { setAuth, setStudentId, setTeacherId, accountId, role, studentId, teacherId } = useAuthStore();

  // Step 1: Get account info (AUTH_ME) - only if we have token and no accountId
  const hasToken = !!tokenStorage.getAccessToken();
  const shouldFetchAuth = hasToken && !accountId && !DEMO_MODE;

  const {
    data: accountData,
    isLoading: isLoadingAccount,
    error: accountError,
  } = useQuery({
    queryKey: [CONTRACT_KEYS.AUTH_ME],
    queryFn: authService.getCurrentUser,
    enabled: shouldFetchAuth,
    retry: 0, // No retry on error
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Step 2a: Get student profile (only if role is STUDENT AND studentId not in profile AND not already set)
  const internalRole = accountData ? mapBackendRoleToInternal(accountData.role) : role;
  const studentIdFromProfile = accountData?.profile?.studentId;
  const shouldFetchStudent =
    !DEMO_MODE &&
    internalRole === "STUDENT" &&
    !!accountData &&
    !studentIdFromProfile && // Skip if studentId is in profile
    !studentId; // Skip if already set

  const {
    data: studentData,
    isLoading: isLoadingStudent,
  } = useQuery({
    queryKey: [CONTRACT_KEYS.STUDENT_GET_ME],
    queryFn: studentService.getMe,
    enabled: shouldFetchStudent,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Step 2b: Get teacher profile (only if role is TEACHER AND teacherId not in profile AND not already set)
  const teacherIdFromProfile = accountData?.profile?.teacherId;
  const shouldFetchTeacher =
    !DEMO_MODE &&
    internalRole === "TEACHER" &&
    !!accountData &&
    !teacherIdFromProfile && // Skip if teacherId is in profile
    !teacherId; // Skip if already set

  const {
    data: teacherData,
    isLoading: isLoadingTeacher,
  } = useQuery({
    queryKey: [CONTRACT_KEYS.TEACHER_GET_ME],
    queryFn: teacherService.getMe,
    enabled: shouldFetchTeacher,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Update auth store when account data arrives
  useEffect(() => {
    if (DEMO_MODE) return;
    if (accountData) {
      const internalRole = mapBackendRoleToInternal(accountData.role);
      
      // DEV: Log bootstrap state
      if (process.env.NODE_ENV === "development") {
        console.log("[AuthBootstrap] AUTH_ME success:", {
          accountId: accountData.accountId,
          role: accountData.role,
          internalRole,
          profile: accountData.profile,
        });
      }
      
      setAuth({
        accountId: accountData.accountId,
        role: internalRole,
        email: accountData.email,
        fullName: accountData.fullName ?? null,
        username: accountData.username,
        avatarUrl: accountData.avatarUrl ?? null,
      });

      // Extract studentId/teacherId from profile if available (avoids extra API call)
      if (accountData.profile?.studentId) {
        if (process.env.NODE_ENV === "development") {
          console.log("[AuthBootstrap] studentId from profile:", accountData.profile.studentId);
        }
        setStudentId(accountData.profile.studentId);
      }
      
      if (accountData.profile?.teacherId) {
        if (process.env.NODE_ENV === "development") {
          console.log("[AuthBootstrap] teacherId from profile:", accountData.profile.teacherId);
        }
        setTeacherId(accountData.profile.teacherId);
      }
    }
  }, [accountData, setAuth, setStudentId, setTeacherId]);

  // Update studentId when student data arrives (fallback if not in profile)
  useEffect(() => {
    if (DEMO_MODE) return;
    if (studentData) {
      if (process.env.NODE_ENV === "development") {
        console.log("[AuthBootstrap] studentId from /students/me:", studentData.id);
      }
      setStudentId(studentData.id);
    }
  }, [studentData, setStudentId]);

  // Update teacherId when teacher data arrives (fallback if not in profile)
  useEffect(() => {
    if (DEMO_MODE) return;
    if (teacherData) {
      if (process.env.NODE_ENV === "development") {
        console.log("[AuthBootstrap] teacherId from /teachers/me:", teacherData.id);
      }
      setTeacherId(teacherData.id);
    }
  }, [teacherData, setTeacherId]);

  // Determine if bootstrap is ready
  const isLoading =
    !DEMO_MODE && (isLoadingAccount || isLoadingStudent || isLoadingTeacher);

  const isReady = (() => {
    // DEMO_MODE: Always ready
    if (DEMO_MODE) {
      return true;
    }
    
    if (!hasToken) {
      // No token = guest, ready immediately
      return true;
    }
    
    if (!accountData) {
      return false; // Still loading account data
    }
    
    const currentRole = mapBackendRoleToInternal(accountData.role);
    
    if (currentRole === "ADMIN") {
      return true; // Admin only needs accountId
    }
    
    if (currentRole === "STUDENT") {
      // Student needs studentId (from profile or /students/me)
      return !!(studentIdFromProfile || studentId || studentData);
    }
    
    if (currentRole === "TEACHER") {
      // Teacher needs teacherId (from profile or /teachers/me)
      return !!(teacherIdFromProfile || teacherId || teacherData);
    }
    
    return false;
  })();

  // DEV: Log bootstrap state transitions
  useEffect(() => {
    if (DEMO_MODE) return;
    if (process.env.NODE_ENV === "development") {
      console.log("[AuthBootstrap] State:", {
        hasToken,
        isLoading,
        isReady,
        accountId,
        role: internalRole,
        studentId: studentIdFromProfile || studentId,
        teacherId: teacherIdFromProfile || teacherId,
        error: accountError?.message,
      });
    }
  }, [hasToken, isLoading, isReady, accountId, internalRole, studentIdFromProfile, studentId, teacherIdFromProfile, teacherId, accountError]);

  // DEMO_MODE: Return early with ready state
  if (DEMO_MODE) {
    return {
      isLoading: false,
      isReady: true,
      error: null,
      accountData: null,
      studentData: null,
      teacherData: null,
    };
  }

  return {
    isLoading,
    isReady,
    error: accountError,
    accountData,
    studentData,
    teacherData,
  };
}

