/**
 * CourseVersionsScreen
 * Route: /courses/:courseId/versions
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /courses/:courseId/versions?page=&size= (VERSION_GET_LIST)
 */
export default function CourseVersionsScreen({
  params,
  searchParams,
}: {
  params: { courseId: string };
  searchParams: { page?: string; size?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>CourseVersionsScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course ID: {params.courseId}
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        Page: {searchParams.page || "1"}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement VERSION_GET_LIST query</li>
          <li>Render versions list</li>
          <li>Add pagination</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

