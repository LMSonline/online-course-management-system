/**
 * CategoryTreeScreen
 * Route: /categories
 * Layout: PublicLayout
 * Guard: none
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /categories/tree (or GET /categories if flat list)
 * 
 * Fields: id, name, slug, children[] (if tree)
 */
export default function CategoryTreeScreen() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>CategoryTreeScreen</h1>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement CATEGORY_GET_TREE query</li>
          <li>Render category tree/list</li>
          <li>Handle empty/error states</li>
          <li>Add navigation to CategoryDetailScreen</li>
        </ul>
      </div>
    </div>
  );
}

