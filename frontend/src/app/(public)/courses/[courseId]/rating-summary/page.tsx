/**
 * CourseRatingSummaryScreen
 * Route: /courses/:courseId/rating-summary
 * Layout: PublicLayout
 * Guard: none
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /courses/:courseId/rating-summary
 */
export default function CourseRatingSummaryScreen({
  params,
}: {
  params: { courseId: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>CourseRatingSummaryScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course ID: {params.courseId}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement REVIEW_GET_RATING_SUMMARY query</li>
          <li>Render rating summary (average, distribution, etc.)</li>
          <li>Handle error states</li>
        </ul>
      </div>
    </div>
  );
}

