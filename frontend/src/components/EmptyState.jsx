import { Inbox } from "lucide-react";

export default function EmptyState({ onCreateTicket, hasFilters }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="rounded-2xl bg-slate-100 p-4 text-slate-500">
        <Inbox size={30} />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-800">
        {hasFilters ? "No matching tickets" : "No tickets yet"}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-slate-500">
        {hasFilters
          ? "Try changing your search or filters."
          : "Create your first support ticket to get started."}
      </p>

      {hasFilters ? null : (
        <button
          onClick={onCreateTicket}
          className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Create your first ticket
        </button>
      )}
    </div>
  );
}