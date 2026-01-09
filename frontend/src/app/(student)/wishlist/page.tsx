/**
 * WishlistScreen
 * Route: /wishlist
 * Layout: AuthenticatedLayout
 * Guard: requireStudent
 * 
 * Note: Only if backend has wishlist feature
 */
export default function WishlistScreen() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>WishlistScreen</h1>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement wishlist API (if backend supports)</li>
          <li>Render wishlist items</li>
          <li>Handle empty/error states</li>
        </ul>
      </div>
    </div>
  );
}

