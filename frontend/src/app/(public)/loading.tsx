export default function PublicLoading() {
  return (
    <div className="min-h-[72vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-4 border-[var(--brand-600)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

