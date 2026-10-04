
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTickets = async (params = {}) => {
  const response = await api.get("/tickets", { params });
  return response.data;
};

export const getTicketSummary = async () => {
  const response = await api.get("/tickets/summary");
  return response.data;
};

export const getTicket = async (id) => {
  const response = await api.get(`/tickets/${id}`);
  return response.data;
};

export const createTicket = async (ticket) => {
  const response = await api.post("/tickets", ticket);
  return response.data;
};

export const updateTicket = async (id, updates) => {
  const response = await api.patch(`/tickets/${id}`, updates);
  return response.data;
};

export default api;