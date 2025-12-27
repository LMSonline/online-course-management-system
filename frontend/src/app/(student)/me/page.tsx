/**
 * AuthMeScreen
 * Route: /me
 * Layout: AuthenticatedLayout
 * Guard: requireAuth (not requireStudent, account-level)
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - GET /auth/me (AUTH_ME)
 */
export default function AuthMeScreen() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>AuthMeScreen</h1>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement AUTH_ME query</li>
          <li>Render account profile (accountId, role, email, etc.)</li>
          <li>Handle error states</li>
        </ul>
      </div>
    </div>
  );
}

