import { X } from "lucide-react";

export default function TicketDetailsModal({ ticket, onClose }) {
  if (!ticket) return null;

  const createdAt = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleString("en-IN")
    : "Not available";

  const updatedAt = ticket.updatedAt
    ? new Date(ticket.updatedAt).toLocaleString("en-IN")
    : "Not available";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-details-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Ticket details
            </p>
            <h2
              id="ticket-details-title"
              className="mt-2 break-words text-xl font-bold text-slate-900"
            >
              {ticket.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close ticket details"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Customer email</p>
            <p className="mt-1 break-all text-sm text-slate-800">
              {ticket.customerEmail}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium uppercase text-slate-400">Priority</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {ticket.priority}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-slate-400">Status</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {ticket.status}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Description</p>
            <p className="mt-2 whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {ticket.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-400">Created</p>
              <p className="mt-1 text-sm text-slate-700">{createdAt}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Last updated</p>
              <p className="mt-1 text-sm text-slate-700">{updatedAt}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Close
        </button>
      </section>
    </div>
  );
}