
import { useCallback, useEffect, useState } from "react";
import {
  getTickets,
  getTicketSummary,
  updateTicket,
} from "../services/api";

function extractTickets(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.tickets)) return data.tickets;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.tickets)) return data.data.tickets;
  return [];
}

function extractPagination(data, fallbackPage, fallbackLimit) {
  const meta = data?.pagination ?? data?.meta ?? data?.data?.pagination ?? {};

  const total = Number(
    meta.total ?? meta.totalTickets ?? data?.total ?? data?.totalTickets ?? data?.data?.total ?? 0
  );

  const pages = Number(
    meta.totalPages ?? meta.pages ?? data?.totalPages ?? data?.data?.totalPages ??
    Math.ceil(total / fallbackLimit)
  );

  return {
    page: Number(meta.page ?? data?.page ?? fallbackPage),
    limit: Number(meta.limit ?? data?.limit ?? fallbackLimit),
    total,
    totalPages: pages,
  };
}

function extractSummary(response) {
  const data = response?.data?.data ?? response?.data ?? response ?? {};
  const counts = data.counts ?? {};

  return {
    total: Number(data.total ?? 0),
    open: Number(counts.Open ?? 0),
    inProgress: Number(counts["In Progress"] ?? 0),
    resolved: Number(counts.Resolved ?? 0),
  };
}

export default function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    sort: "newest",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshSummary = useCallback(async () => {
    setSummaryLoading(true);

    try {
      const data = await getTicketSummary();
      setSummary(extractSummary(data));
    } catch (err) {
      console.error("Summary request failed:", err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const refreshTickets = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        sort: filters.sort,
      };

      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;

      const data = await getTickets(params);
      const list = extractTickets(data);
      const pageInfo = extractPagination(
        data,
        filters.page,
        filters.limit
      );

      setTickets(list);
      setPagination(pageInfo);
    } catch (err) {
      console.error("Ticket request failed:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Unable to load tickets. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refreshSummary();
  }, [refreshSummary]);

  useEffect(() => {
    refreshTickets();
  }, [refreshTickets]);

  const changeFilter = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters((current) => ({
      ...current,
      search: "",
      status: "",
      priority: "",
      sort: "newest",
      page: 1,
    }));
  };

  const changePage = (page) => {
    setFilters((current) => ({
      ...current,
      page: Math.max(1, page),
    }));
  };

  const changeTicket = async (id, updates) => {
    const result = await updateTicket(id, updates);

    await Promise.all([refreshTickets(), refreshSummary()]);

    return result;
  };

  const refreshAll = async () => {
    await Promise.all([refreshTickets(), refreshSummary()]);
  };

  return {
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
    refreshTickets,
    refreshSummary,
    refreshAll,
  };
}