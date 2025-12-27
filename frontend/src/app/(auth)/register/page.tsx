/**
 * RegisterScreen
 * Route: /register
 * Layout: PublicMinimalLayout
 * Guard: guestOnly
 * 
 * Note: This is the docs-standard route. /signup may redirect here.
 */
export default function RegisterScreen() {
  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">RegisterScreen</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        This is a placeholder. The actual register form should be implemented here.
      </p>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement registration form</li>
          <li>Use AUTH_REGISTER mutation</li>
          <li>Handle validation errors</li>
          <li>Redirect to verify-email after success</li>
        </ul>
      </div>
    </div>
  );
}

