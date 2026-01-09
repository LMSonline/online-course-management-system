/**
 * RecommendationScreen
 * Route: /recommendations
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 */
export default function RecommendationScreen() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>RecommendationScreen</h1>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement RECOMMENDATION_GET query</li>
          <li>Render recommended courses</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

