import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 shrink-0 text-red-600" size={20} />
        <div>
          <p className="font-semibold text-red-800">
            Could not load tickets
          </p>
          <p className="mt-1 break-words text-sm text-red-700">{message}</p>
        </div>
      </div>

      <button
        onClick={onRetry}
        className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
      >
        <RefreshCw size={15} />
        Retry
      </button>
    </div>
  );
}