import { useQuery } from "@tanstack/react-query";
import { teacherService } from "@/services/teacher/teacher.service";
import { TeacherProfile } from "@/services/teacher/teacher.service";
import { CONTRACT_KEYS } from "@/lib/api/contractKeys";

/**
 * Hook to fetch teacher public profile by ID
 * Contract Key: TEACHER_GET_BY_ID
 * 
 * Note: id must be teacherId (NOT accountId)
 */
export function useTeacherPublicProfile(id: number | string | undefined) {
  const teacherId = typeof id === "string" ? parseInt(id, 10) : id;
  
  return useQuery<TeacherProfile>({
    queryKey: [CONTRACT_KEYS.TEACHER_GET_BY_ID, teacherId],
    queryFn: () => teacherService.getById(teacherId!),
    enabled: !!teacherId && !isNaN(teacherId),
    staleTime: 60_000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

