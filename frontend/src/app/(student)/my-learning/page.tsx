/**
 * MyEnrollmentsScreen
 * Route: /my-learning
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /students/me (to get studentId)
 * - GET /students/{studentId}/enrollments?page=&size=&sort=updatedAt,desc
 */
export default function MyEnrollmentsScreen({
  searchParams,
}: {
  searchParams: { page?: string; size?: string; sort?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>MyEnrollmentsScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Page: {searchParams.page || "1"}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Get studentId from authStore</li>
          <li>Implement ENROLLMENT_GET_STUDENT_LIST query</li>
          <li>Render enrollments list with progress</li>
          <li>Add pagination</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

