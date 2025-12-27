/**
 * EditCourseReviewScreen
 * Route: /courses/:courseId/reviews/:reviewId/edit
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 */
export default function EditCourseReviewScreen({
  params,
}: {
  params: { courseId: string; reviewId: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>EditCourseReviewScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course ID: {params.courseId}, Review ID: {params.reviewId}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement REVIEW_UPDATE mutation</li>
          <li>Render edit review form</li>
          <li>Handle validation/error states</li>
        </ul>
      </div>
    </div>
  );
}

