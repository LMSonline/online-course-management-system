/**
 * TeacherCourseEditScreen
 * Route: /teacher/courses/:id/edit
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /courses/:id (COURSE_GET_DETAIL)
 * - PUT /teacher/courses/:id (COURSE_UPDATE) on submit
 */
export default function TeacherCourseEditScreen({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>TeacherCourseEditScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course ID: {params.id}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement COURSE_GET_DETAIL query</li>
          <li>Implement COURSE_UPDATE mutation</li>
          <li>Render course edit form</li>
          <li>Handle validation/error states</li>
        </ul>
      </div>
    </div>
  );
}

