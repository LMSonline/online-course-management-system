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
export default async function MyEnrollmentsScreen({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const page = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const size = Array.isArray(sp.size) ? sp.size[0] : sp.size;
  const sort = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>MyEnrollmentsScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Page: {page || "1"}
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

