/**
 * CreateVersionScreen
 * Route: /courses/:courseId/versions/new
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - POST /courses/:courseId/versions (VERSION_CREATE) on submit
 */
export default function CreateVersionScreen({
  params,
}: {
  params: { courseId: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>CreateVersionScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course ID: {params.courseId}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement VERSION_CREATE mutation</li>
          <li>Render version creation form</li>
          <li>Handle validation/error states</li>
        </ul>
      </div>
    </div>
  );
}

