export default function LoadingSpinner({ label = "Loading tickets..." }) {
  return (
    <div
      role="status"
      className="flex min-h-52 flex-col items-center justify-center gap-3 text-sm text-slate-500"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
      <span>{label}</span>
    </div>
  );
}