/**
 * WriteCourseReviewScreen
 * Route: /courses/:courseId/reviews/new
 * Layout: AuthenticatedLayout
 * Guard: requireStudent (require enroll)
 */
export default function WriteCourseReviewScreen({
  params,
}: {
  params: { courseId: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>WriteCourseReviewScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course ID: {params.courseId}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Check enrollment status</li>
          <li>Implement REVIEW_GET_RATING_SUMMARY (optional)</li>
          <li>Implement REVIEW_CREATE mutation</li>
          <li>Render review form</li>
          <li>Handle validation/error states</li>
        </ul>
      </div>
    </div>
  );
}

