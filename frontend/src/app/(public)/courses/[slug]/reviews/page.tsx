/**
 * CourseReviewsPublicScreen
 * Route: /courses/:slug/reviews
 * Layout: PublicLayout
 * Guard: none
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /courses/:courseId/reviews?page=&size=
 * - (optional) REVIEW_GET_RATING_SUMMARY
 */
export default function CourseReviewsPublicScreen({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string; size?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>CourseReviewsPublicScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course slug: {params.slug}
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        Page: {searchParams.page || "1"}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement REVIEW_GET_COURSE_LIST query</li>
          <li>Implement REVIEW_GET_RATING_SUMMARY (optional)</li>
          <li>Render reviews list with pagination</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

