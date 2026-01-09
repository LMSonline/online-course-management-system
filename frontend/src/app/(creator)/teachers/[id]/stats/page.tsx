/**
 * TeacherStatsScreen
 * Route: /teachers/:id/stats
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * NOTE: :id = teacherId (NOT accountId), use teacherId from TEACHER_GET_ME
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /teachers/:id/stats (id = teacherId)
 */
export default function TeacherStatsScreen({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>TeacherStatsScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Teacher ID (teacherId): {params.id}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Get teacherId from authStore</li>
          <li>Implement TEACHER_GET_STATS query (id = teacherId)</li>
          <li>Render teacher statistics</li>
          <li>Handle error states</li>
        </ul>
      </div>
    </div>
  );
}

