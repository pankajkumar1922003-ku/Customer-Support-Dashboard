import { useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  title: "",
  description: "",
  customerEmail: "",
  priority: "Medium",
};

export default function CreateTicketModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim() || !form.customerEmail.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.title.trim().length > 120) {
      setError("Title cannot exceed 120 characters.");
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        customerEmail: form.customerEmail.trim(),
        priority: form.priority,
      });

      setForm(initialForm);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Unable to create ticket."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-ticket-title"
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-7"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id="create-ticket-title" className="text-xl font-bold text-slate-900">
              Create Ticket
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the customer issue details.
            </p>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Ticket title <span className="text-red-500">*</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={120}
              required
              placeholder="e.g. Unable to log in"
              className={inputClass}
            />
            <span className="mt-1 block text-right text-xs font-normal text-slate-400">
              {form.title.length}/120
            </span>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Customer email <span className="text-red-500">*</span>
            <input
              type="email"
              name="customerEmail"
              value={form.customerEmail}
              onChange={handleChange}
              required
              placeholder="customer@example.com"
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Description <span className="text-red-500">*</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the issue..."
              className={`${inputClass} resize-y`}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Priority
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}