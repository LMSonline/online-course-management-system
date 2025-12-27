/**
 * TeacherCourseCreateScreen
 * Route: /teacher/courses/new
 * Layout: CreatorLayout
 * Guard: requireCreator
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - POST /teacher/courses (COURSE_CREATE) on submit
 */
export default function TeacherCourseCreateScreen() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>TeacherCourseCreateScreen</h1>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement COURSE_CREATE mutation</li>
          <li>Render course creation form</li>
          <li>Handle validation/error states</li>
        </ul>
      </div>
    </div>
  );
}

