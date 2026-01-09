import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student/student.service";

export function useStudentCertificates(studentId: number, page: number = 0, size: number = 12) {
  return useQuery({
    queryKey: [
      "student-certificates",
      { studentId, page, size },
    ],
    queryFn: () => studentService.getStudentCertificates(studentId, page, size),
    enabled: !!studentId,
    staleTime: 60_000,
    placeholderData: () => ({ items: [], totalPages: 0, totalItems: 0, page, size }),
  });
}
