/**
 * CourseEnrollmentsScreen
 * Route: /courses/:courseId/enrollments
 * Layout: CreatorLayout
 * Guard: requireCreator
 */
export default function CourseEnrollmentsScreen({
  params,
  searchParams,
}: {
  params: { courseId: string };
  searchParams: { page?: string; size?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>CourseEnrollmentsScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course ID: {params.courseId}
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        Page: {searchParams.page || "1"}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement ENROLLMENT_GET_COURSE_LIST query</li>
          <li>Render enrollments list</li>
          <li>Add pagination</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

