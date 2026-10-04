import { useState } from "react";
import { RefreshCw } from "lucide-react";

import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import TicketFilters from "../components/TicketFilters";
import TicketTable from "../components/TicketTable";
import TicketCard from "../components/TicketCard";
import Pagination from "../components/Pagination";
import CreateTicketModal from "../components/CreateTicketModal";
import TicketDetailsModal from "../components/TicketDetailsModal";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import useTickets from "../hooks/useTickets";
import { createTicket } from "../services/api";

export default function Dashboard() {
  const {
    tickets,
    summary,
    filters,
    pagination,
    loading,
    summaryLoading,
    error,
    changeFilter,
    resetFilters,
    changePage,
    changeTicket,
    refreshAll,
  } = useTickets();

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const handleCreate = async (ticketData) => {
    await createTicket(ticketData);
    await refreshAll();
  };

  const handleUpdate = async (id, updates) => {
    setUpdatingId(id);
    setActionError("");

    try {
      await changeTicket(id, updates);
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Could not update the ticket."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const hasFilters = Boolean(
    filters.search.trim() || filters.status || filters.priority
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onCreateTicket={() => setCreateOpen(true)} />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <section>
          <p className="text-sm font-semibold text-indigo-600">
            WORKSPACE / OVERVIEW
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Support Dashboard
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Manage customer issues and track ticket progress.
              </p>
            </div>

            <button
              onClick={refreshAll}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </section>

        <SummaryCards summary={summary} loading={summaryLoading} />

        <section className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">All Tickets</h3>
            <p className="mt-1 text-sm text-slate-500">
              Search, filter and manage your support requests.
            </p>
          </div>

          <TicketFilters
            filters={filters}
            onFilterChange={changeFilter}
            onReset={resetFilters}
          />
        </section>

        {actionError && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>{actionError}</p>
            <button
              onClick={() => setActionError("")}
              className="shrink-0 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="p-4 sm:p-6">
              <ErrorMessage message={error} onRetry={refreshAll} />
            </div>
          ) : tickets.length === 0 ? (
            <EmptyState
              hasFilters={hasFilters}
              onCreateTicket={() => setCreateOpen(true)}
            />
          ) : (
            <>
              <TicketTable
                tickets={tickets}
                onUpdate={handleUpdate}
                onView={setSelectedTicket}
                updatingId={updatingId}
              />

              <div className="space-y-3 p-3 md:hidden">
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket._id ?? ticket.id}
                    ticket={ticket}
                    onUpdate={handleUpdate}
                    onView={setSelectedTicket}
                    updatingId={updatingId}
                  />
                ))}
              </div>

              <Pagination
                pagination={pagination}
                onPageChange={changePage}
                loading={loading}
              />
            </>
          )}
        </section>

        <footer className="pb-3 text-center text-xs text-slate-400">
          SupportDesk · Support Ticket Management
        </footer>
      </main>

      <CreateTicketModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <TicketDetailsModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
}