/**
 * TeacherCourseEditScreen
 * Route: /teacher/courses/:slug/edit
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /courses/:slug (COURSE_GET_DETAIL)
 * - PUT /teacher/courses/:id (COURSE_UPDATE) on submit (use courseId from detail)
 */
export default function TeacherCourseEditScreen({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>TeacherCourseEditScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Course slug: {params.slug}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement COURSE_GET_DETAIL query (by slug)</li>
          <li>Implement COURSE_UPDATE mutation (use courseId from detail)</li>
          <li>Render course edit form</li>
          <li>Handle validation/error states</li>
        </ul>
      </div>
    </div>
  );
}

