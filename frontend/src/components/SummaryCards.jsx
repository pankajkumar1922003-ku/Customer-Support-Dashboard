import { CheckCircle2, CircleDot, Layers3, Timer } from "lucide-react";

const cards = [
  {
    key: "total",
    label: "Total Tickets",
    icon: Layers3,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    key: "open",
    label: "Open",
    icon: CircleDot,
    color: "bg-sky-50 text-sky-600",
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: Timer,
    color: "bg-amber-50 text-amber-600",
  },
  {
    key: "resolved",
    label: "Resolved",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function SummaryCards({ summary, loading }) {
  return (
    <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, color }) => (
        <article
          key={key}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <div className={`rounded-xl p-2 ${color}`}>
              <Icon size={19} />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
            {loading ? "—" : summary[key].toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-slate-400">All tickets</p>
        </article>
      ))}
    </section>
  );
}