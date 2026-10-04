import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  pagination,
  onPageChange,
  loading,
}) {
  const { page, limit, total, totalPages } = pagination;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = [];
  const first = Math.max(1, page - 2);
  const last = Math.min(totalPages, page + 2);

  for (let i = first; i <= last; i += 1) {
    pages.push(i);
  }

  if (totalPages <= 1 && total === 0) return null;

  return (
    <div className="flex flex-col gap-4 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-700">{start}</span>
        {"–"}
        <span className="font-medium text-slate-700">{end}</span>
        {" of "}
        <span className="font-medium text-slate-700">{total}</span> tickets
      </p>

      <div className="flex flex-wrap items-center gap-1">
        <button
          disabled={loading || page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={17} />
        </button>

        {pages.map((number) => (
          <button
            key={number}
            disabled={loading}
            onClick={() => onPageChange(number)}
            className={`min-w-9 rounded-lg px-3 py-2 text-sm font-medium ${
              number === page
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {number}
          </button>
        ))}

        <button
          disabled={loading || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}