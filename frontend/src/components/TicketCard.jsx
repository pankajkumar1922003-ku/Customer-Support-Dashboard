import { Eye } from "lucide-react";

const statusStyles = {
  Open: "bg-sky-50 text-sky-700",
  "In Progress": "bg-amber-50 text-amber-700",
  Resolved: "bg-emerald-50 text-emerald-700",
};

const priorityStyles = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-orange-50 text-orange-700",
  High: "bg-red-50 text-red-700",
};

export default function TicketCard({ ticket, onUpdate, onView, updatingId }) {
  const id = ticket._id ?? ticket.id;
  const busy = updatingId === id;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words font-semibold text-slate-800">
            {ticket.title}
          </h3>
          <p className="mt-1 break-all text-xs text-slate-500">
            {ticket.customerEmail}
          </p>
        </div>

        <button
          onClick={() => onView(ticket)}
          aria-label={`View ${ticket.title}`}
          className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
        >
          <Eye size={18} />
        </button>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600">
        {ticket.description}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="min-w-0 text-xs text-slate-500">
          Priority
          <select
            disabled={busy}
            value={ticket.priority}
            onChange={(e) => onUpdate(id, { priority: e.target.value })}
            className={`mt-1 block w-full rounded-lg border-0 px-2 py-2 text-xs font-semibold ${priorityStyles[ticket.priority] || ""}`}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label className="min-w-0 text-xs text-slate-500">
          Status
          <select
            disabled={busy}
            value={ticket.status}
            onChange={(e) => onUpdate(id, { status: e.target.value })}
            className={`mt-1 block w-full rounded-lg border-0 px-2 py-2 text-xs font-semibold ${statusStyles[ticket.status] || ""}`}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </label>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Created:{" "}
        {ticket.createdAt
          ? new Date(ticket.createdAt).toLocaleDateString("en-IN")
          : "—"}
      </p>
    </article>
  );
}