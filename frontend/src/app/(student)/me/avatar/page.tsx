/**
 * UploadAvatarScreen
 * Route: /me/avatar
 * Layout: AuthenticatedLayout
 * Guard: requireAuth
 * 
 * TODO: Initial queries from Per-screenDataContract.md
 * - POST /accounts/me/avatar (ACCOUNT_UPLOAD_AVATAR) on upload
 */
export default function UploadAvatarScreen() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>UploadAvatarScreen</h1>
      <div className="mt-4">
        <h2 className="font-semibold">TODO:</h2>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li>Implement ACCOUNT_UPLOAD_AVATAR mutation</li>
          <li>Render avatar upload form</li>
          <li>Handle file upload/error states</li>
        </ul>
      </div>
    </div>
  );
}

