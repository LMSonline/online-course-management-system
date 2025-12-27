/**
 * TeacherCourseListScreen
 * Route: /teacher/courses
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /teacher/courses?page=&size= (TEACHER_GET_COURSES)
 */
export default function TeacherCourseListScreen({
  searchParams,
}: {
  searchParams: { page?: string; size?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>TeacherCourseListScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Page: {searchParams.page || "1"}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement TEACHER_GET_COURSES query</li>
          <li>Render courses list</li>
          <li>Add pagination</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

