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
export default async function CourseReviewsPublicScreen({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const size = Array.isArray(sp.size) ? sp.size[0] : sp.size;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>CourseReviewsPublicScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course slug: {slug}
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        Page: {page || "1"}
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

