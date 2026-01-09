/**
 * TeacherRevenueScreen
 * Route: /teachers/:id/revenue
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * NOTE: :id = teacherId (NOT accountId), use teacherId from TEACHER_GET_ME
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /teachers/:id/revenue (id = teacherId)
 */
export default function TeacherRevenueScreen({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>TeacherRevenueScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Teacher ID (teacherId): {params.id}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Get teacherId from authStore</li>
          <li>Implement TEACHER_GET_REVENUE query (id = teacherId)</li>
          <li>Render teacher revenue</li>
          <li>Handle error states</li>
        </ul>
      </div>
    </div>
  );
}

