/**
 * CourseLearningHomeScreen
 * Route: /learn/:courseSlug
 * Layout: AuthenticatedLayout
 * Guard: requireStudent (+ enrolledGuard optional)
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /courses/:slug
 * - GET /courses/{courseId}/chapters (curriculum tree)
 * - GET /progress/courses/{courseId} (progress overview)
 */
export default function CourseLearningHomeScreen({
  params,
}: {
  params: { courseSlug: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>CourseLearningHomeScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course slug: {params.courseSlug}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement COURSE_GET_DETAIL query</li>
          <li>Implement CHAPTER_GET_LIST query</li>
          <li>Implement PROGRESS_GET_COURSE query</li>
          <li>Render course learning home with curriculum</li>
          <li>Handle 403 (not enrolled) → CTA enroll</li>
          <li>Handle error states</li>
        </ul>
      </div>
    </div>
  );
}

