/**
 * CreateCourseCommentScreen
 * Route: /courses/:courseId/comments/new
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 */
export default function CreateCourseCommentScreen({
  params,
}: {
  params: { courseId: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>CreateCourseCommentScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course ID: {params.courseId}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement COURSE_GET_DETAIL (optional)</li>
          <li>Implement COMMENT_CREATE_COURSE mutation</li>
          <li>Render comment form</li>
          <li>Handle validation/error states</li>
        </ul>
      </div>
    </div>
  );
}

