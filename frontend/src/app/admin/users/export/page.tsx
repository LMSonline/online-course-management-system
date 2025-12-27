/**
 * AdminExportUsersScreen
 * Route: /admin/users/export
 * Layout: AdminLayout
 * Guard: requireAdmin
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - POST /admin/users/export (ADMIN_EXPORT_USERS_ACTION)
 */
export default function AdminExportUsersScreen() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>AdminExportUsersScreen</h1>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement ADMIN_EXPORT_USERS_ACTION mutation</li>
          <li>Render export form</li>
          <li>Handle download/error states</li>
        </ul>
      </div>
    </div>
  );
}

