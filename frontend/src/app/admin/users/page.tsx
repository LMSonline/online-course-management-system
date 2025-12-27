/**
 * AdminUsersScreen
 * Route: /admin/users
 * Layout: AdminLayout
 * Guard: requireAdmin
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /admin/users?page=&size= (ADMIN_GET_USERS)
 */
export default function AdminUsersScreen({
  searchParams,
}: {
  searchParams: { page?: string; size?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>AdminUsersScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Page: {searchParams.page || "1"}
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement ADMIN_GET_USERS query</li>
          <li>Render users list</li>
          <li>Add pagination</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

