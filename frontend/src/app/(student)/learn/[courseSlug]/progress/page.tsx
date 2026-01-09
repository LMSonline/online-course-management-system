/**
 * CourseProgressOverviewScreen
 * Route: /learn/:courseSlug/progress
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /progress/courses/{courseId} (progress overview)
 */
export default function CourseProgressOverviewScreen({
  params,
}: {
  params: { courseSlug: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>CourseProgressOverviewScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course slug: {params.courseSlug}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement PROGRESS_GET_COURSE query</li>
          <li>Render progress overview</li>
          <li>Handle error states</li>
        </ul>
      </div>
    </div>
  );
}

