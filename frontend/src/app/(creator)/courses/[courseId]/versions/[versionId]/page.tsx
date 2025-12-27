/**
 * VersionDetailScreen
 * Route: /courses/:courseId/versions/:versionId
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /courses/:courseId/versions/:versionId (VERSION_GET_DETAIL)
 */
export default function VersionDetailScreen({
  params,
}: {
  params: { courseId: string; versionId: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>VersionDetailScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course ID: {params.courseId}, Version ID: {params.versionId}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement VERSION_GET_DETAIL query</li>
          <li>Render version details</li>
          <li>Handle 404/error states</li>
        </ul>
      </div>
    </div>
  );
}

