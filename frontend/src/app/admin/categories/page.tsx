/**
 * AdminCategoriesScreen
 * Route: /admin/categories
 * Layout: AdminLayout
 * Guard: requireAdmin
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /categories/tree (CATEGORY_GET_TREE)
 */
export default function AdminCategoriesScreen() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>AdminCategoriesScreen</h1>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement CATEGORY_GET_TREE query</li>
          <li>Implement CATEGORY_CREATE mutation</li>
          <li>Implement CATEGORY_UPDATE mutation</li>
          <li>Implement CATEGORY_DELETE mutation</li>
          <li>Render categories management</li>
          <li>Handle error states</li>
        </ul>
      </div>
    </div>
  );
}

