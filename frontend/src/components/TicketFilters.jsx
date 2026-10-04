import { RotateCcw, Search } from "lucide-react";

export default function TicketFilters({
  filters,
  onFilterChange,
  onReset,
}) {
  const selectClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.6fr)_1fr_1fr_1fr_auto]">
        <label className="relative block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search title or customer email..."
            className={`${selectClass} pl-10`}
          />
        </label>

        <select
          aria-label="Filter by status"
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className={selectClass}
        >
          <option value="">All statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          aria-label="Filter by priority"
          value={filters.priority}
          onChange={(e) => onFilterChange("priority", e.target.value)}
          className={selectClass}
        >
          <option value="">All priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          aria-label="Sort tickets"
          value={filters.sort}
          onChange={(e) => onFilterChange("sort", e.target.value)}
          className={selectClass}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>

        <button
          onClick={onReset}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </div>
    </section>
  );
}