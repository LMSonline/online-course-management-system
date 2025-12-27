/**
 * CourseDetailScreen
 * Route: /courses/:slug
 * Layout: PublicLayout
 * Guard: none
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /courses/:slug
 * - (optional) GET /courses/:courseId/rating-summary
 */
export default function CourseDetailScreen({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>CourseDetailScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course slug: {params.slug}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement COURSE_GET_DETAIL query</li>
          <li>Implement REVIEW_GET_RATING_SUMMARY (optional)</li>
          <li>Render course landing page</li>
          <li>Add CTA: Enroll / Start learning</li>
          <li>Handle 404/error states</li>
        </ul>
      </div>
    </div>
  );
}

