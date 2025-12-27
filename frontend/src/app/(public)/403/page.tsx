/**
 * ForbiddenScreen
 * Route: /403
 * Layout: PublicLayout
 * Guard: none
 */
export default function ForbiddenScreen() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-2">Forbidden</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You don't have permission to access this resource.
        </p>
        <a href="/" className="text-blue-600 hover:underline">
          Go back to home
        </a>
      </div>
    </div>
  );
}

