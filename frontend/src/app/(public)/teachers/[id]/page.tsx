/**
 * TeacherPublicProfileScreen
 * Route: /teachers/:id
 * Layout: PublicLayout
 * Guard: none
 * 
 * NOTE: :id = teacherId (NOT accountId)
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /teachers/:id
 * - GET /courses?teacherId=:id&page=&size=&sort=popular
 */
export default function TeacherPublicProfileScreen({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string; size?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>TeacherPublicProfileScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Teacher ID (teacherId): {params.id}
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        Page: {searchParams.page || "1"}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement TEACHER_GET_BY_ID query (id = teacherId)</li>
          <li>Implement COURSE_GET_LIST with teacherId filter</li>
          <li>Render teacher profile and courses list</li>
          <li>Add pagination for courses</li>
          <li>Handle 404/empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

