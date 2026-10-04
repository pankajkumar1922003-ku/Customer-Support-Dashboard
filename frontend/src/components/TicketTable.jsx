import { Eye } from "lucide-react";

const statusStyles = {
  Open: "bg-sky-50 text-sky-700 ring-sky-200",
  "In Progress": "bg-amber-50 text-amber-700 ring-amber-200",
  Resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const priorityStyles = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-orange-50 text-orange-700",
  High: "bg-red-50 text-red-700",
};

function formatDate(date) {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TicketTable({
  tickets,
  onUpdate,
  onView,
  updatingId,
}) {
  const selectClass =
    "max-w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-indigo-500";

  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[900px] text-left">
        <thead className="border-y border-slate-100 bg-slate-50/70">
          <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-5 py-4">Ticket</th>
            <th className="px-5 py-4">Customer</th>
            <th className="px-5 py-4">Priority</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Created</th>
            <th className="px-5 py-4">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {tickets.map((ticket) => {
            const id = ticket._id ?? ticket.id;
            const busy = updatingId === id;

            return (
              <tr key={id} className="transition hover:bg-slate-50/70">
                <td className="max-w-xs px-5 py-4">
                  <p className="truncate font-semibold text-slate-800">
                    {ticket.title}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {ticket.description}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm text-slate-700">
                    {ticket.customerEmail}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <select
                    aria-label={`Priority for ${ticket.title}`}
                    disabled={busy}
                    value={ticket.priority}
                    onChange={(e) =>
                      onUpdate(id, { priority: e.target.value })
                    }
                    className={`${selectClass} ${priorityStyles[ticket.priority] || ""}`}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </td>

                <td className="px-5 py-4">
                  <select
                    aria-label={`Status for ${ticket.title}`}
                    disabled={busy}
                    value={ticket.status}
                    onChange={(e) =>
                      onUpdate(id, { status: e.target.value })
                    }
                    className={`${selectClass} ring-1 ring-inset ${statusStyles[ticket.status] || ""}`}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                  {formatDate(ticket.createdAt)}
                </td>

                <td className="px-5 py-4">
                  <button
                    onClick={() => onView(ticket)}
                    aria-label={`View ${ticket.title}`}
                    className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}