// Hook: useStudentEnrollmentsWithCourses
// Lấy danh sách khoá học student đã đăng ký (có phân trang), trả về dạng MyCourse[]

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { learnerEnrollmentService } from "@/services/learner/enrollmentService";
import { learnerCourseService } from "@/services/learner/courseService";
import type { MyCourse } from "@/lib/learner/dashboard/types";
import { Enrollment, EnrollmentListResponse } from "@/lib/learner/enrollment/enrollments";
// Định nghĩa lại type cho CourseResponse đúng backend
type CourseResponse = {
  id: number;
  title: string;
  slug?: string;
  teacherName?: string;
  difficulty?: string;
  categoryName?: string;
  thumbnailUrl?: string;
};


export function useStudentEnrollmentsWithCourses(page: number, size: number) {



  // const { user } = useAuth();
  const { user, isLoading: authLoading } = useAuth();
  console.log("AUTH USER:", user);

  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
//đầy đủ cho card như hình 
  // useEffect(() => {
//   if (authLoading || !user?.id) return;

//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       // 1️⃣ enrollments
//       const pageRes = await learnerEnrollmentService.getEnrollments(
//         user.id,
//         page,
//         size
//       );

//       const enrollments = pageRes.items ?? [];

//       // 2️⃣ courses
//       const courseIds = enrollments.map(e => e.courseId);
//       const courses = await learnerCourseService.getCoursesByIds(courseIds);

//       // 3️⃣ map
//       setCourses(
//         enrollments.map(e => {
//           const c = courses.find(x => x.id === e.courseId);

//           return {
//             id: String(e.courseId),
//             courseId: e.courseId,
//             slug: c?.slug ?? String(e.courseId),
//             title: c?.title ?? e.courseTitle,
//             instructor: c?.teacherName ?? "Unknown",
//             thumbColor: "from-emerald-500 via-sky-500 to-indigo-500",
//             thumbnailUrl: c?.thumbnailUrl,
//             progress: e.completionPercentage ?? 0,
//             lastViewed: "New",
//             level: (c?.difficulty as any) ?? "Beginner",
//             category: c?.categoryName ?? "",
//             rating: c?.rating ?? 0,
//           };
//         })
//       );

//       setTotal(pageRes.totalItems ?? 0);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   fetchData();
// }, [authLoading, user?.id, page, size]);

  useEffect(() => {
  if (authLoading || !user?.id) return;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const pageResponse = await learnerEnrollmentService.getEnrollments(
        user.id,
        page,
        size
      );

      const enrollments = pageResponse.items ?? [];
      setTotal(pageResponse.totalItems ?? 0);

      setCourses(
        enrollments.map((e) => ({
          id: String(e.courseId),
          courseId: e.courseId,
          slug: String(e.courseId),
          title: e.courseTitle,
          instructor: "Unknown",
          thumbColor: "from-emerald-500 via-sky-500 to-indigo-500",
          thumbnailUrl: undefined,
          progress: e.completionPercentage ?? 0,
          lastViewed: "-",
          level: "Beginner",
          category: "",
          rating: 0,
        }))
      );
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [authLoading, user?.id, page, size]);


  return { courses, total, isLoading };
}



