import { useQuery } from "@tanstack/react-query";
import { enrollmentService } from "@/services/enrollment/enrollment.service";
import { PageResponse, EnrollmentResponse } from "@/services/enrollment/enrollment.service";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

interface UseStudentEnrollmentsQueryProps {
  studentId: number | null | undefined;
  page?: number;
  size?: number;
}

/**
 * Hook to fetch student enrollments
 * Contract Key: ENROLLMENT_GET_STUDENT_LIST
 * 
 * Requires studentId from authStore (hydrated via bootstrap)
 */
export function useStudentEnrollments({
  studentId,
  page = 0,
  size = 20,
}: UseStudentEnrollmentsQueryProps) {
  return useQuery<PageResponse<EnrollmentResponse>>({
    queryKey: [CONTRACT_KEYS.ENROLLMENT_GET_STUDENT_LIST, { studentId, page, size }],
    queryFn: () => enrollmentService.getStudentEnrollments(studentId!, page, size),
    enabled: !!studentId,
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

