
import { Headset, Plus } from "lucide-react";

export default function Navbar({ onCreateTicket }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Headset size={23} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              SupportDesk
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              Customer support dashboard
            </p>
          </div>
        </div>

        <button
          onClick={onCreateTicket}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Create Ticket</span>
          <span className="sm:hidden">Create</span>
        </button>
      </div>
    </header>
  );
}