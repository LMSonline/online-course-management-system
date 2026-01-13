
// Hook chuẩn hóa lấy toàn bộ dữ liệu cho trang course detail
export function useCourseDetail(slug: string) {
  // 1. Lấy thông tin course cơ bản
  const {
    data: course,
    isLoading: loadingCourse,
    isError: errorCourse,
    error: errorCourseObj
  } = useCourseBySlug(slug);

  // 2. Lấy version đã publish (giá, mô tả, ...)
  const {
    data: version,
    isLoading: loadingVersion,
    isError: errorVersion,
    error: errorVersionObj
  } = usePublishedCourseVersionBySlug(slug);

  // 3. Lấy comment cho course (nếu có id)
  const courseId = course?.id ? Number(course.id) : undefined;
  const {
    data: comments,
    isLoading: loadingComments,
    isError: errorComments,
    error: errorCommentsObj
  } = useCourseComments(courseId || 0);

  // 4. Lấy rating breakdown (nếu có id)
  const {
    data: ratingSummary,
    isLoading: loadingRating,
    isError: errorRating,
    error: errorRatingObj
  } = usePublicRatingSummary(courseId || 0);

  // 5. Chuẩn hóa dữ liệu detail (ưu tiên trường từ version)
  let courseDetail = null;
  let courseIdNum = undefined;
  if (course && version) {
    // Tính toán giá cũ và phần trăm giảm giá nếu có
    const price = version.price ?? course.price ?? 0;
    // Các trường chỉ có ở FE mock hoặc backend mới, cần fallback nếu không có
    // Không truy cập các trường không tồn tại trên CourseVersionResponse
    courseIdNum = course.courseId || course.id;
    courseDetail = {
      id: String(course.id),
      slug: slug,
      title: version.title || course.title,
      subtitle: '',
      rating: ratingSummary?.averageRating ?? 0,
      ratingCount: ratingSummary?.totalReviews ?? 0,
      studentsCount: 0,
      lastUpdated: version.publishedAt ? new Date(version.publishedAt).toLocaleDateString() : '',
      language: 'English',
      subtitles: [],
      level: 'Beginner' as 'Beginner',
      whatYouWillLearn: [],
      includes: [],
      sections: [],
      description: version.description || course.description || '',
      instructor: {
        name: '',
        title: '',
        avatarUrl: undefined,
        about: '',
      },
      price,
      oldPrice: undefined,
      discountPercent: undefined,
      currency: '$',
      thumbnailUrl: version.thumbnailUrl || course.thumbnail || course.thumbnailUrl || undefined,
      courseId: courseIdNum,
    };
  }

  // 6. Tổng hợp trạng thái loading/error
  const loading = loadingCourse || loadingVersion;
  const error = errorCourse || errorVersion;
  const errorObj = errorCourseObj || errorVersionObj;

  // Patch comments to add authorName for UI compatibility
  const patchedComments = (comments || []).map((c) => ({
    ...c,
    authorName: c.username || "Anonymous",
  }));

  return {
    courseDetail,
    courseId: courseIdNum,
    comments: patchedComments,
    ratingSummary,
    loading,
    error,
    errorObj,
    loadingComments,
    errorComments,
    errorCommentsObj,
    loadingRating,
    errorRating,
    errorRatingObj,
  };
}
import { useCourseBySlug } from "./useCourseBySlug";
import { usePublishedCourseVersionBySlug } from "./useCourseVersionPublic";
import { useCourseComments } from "./useComment";
import { usePublicRatingSummary } from "./useReview";
