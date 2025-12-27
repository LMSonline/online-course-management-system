/**
 * StudentMeScreen
 * Route: /students/me
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /students/me (usually already hydrated)
 */
export default function StudentMeScreen() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>StudentMeScreen</h1>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement STUDENT_GET_ME query (usually already hydrated)</li>
          <li>Render student profile</li>
          <li>Handle error states</li>
        </ul>
      </div>
    </div>
  );
}

