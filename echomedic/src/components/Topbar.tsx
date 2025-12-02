import { useAuth } from "../context/useAuth";

export default function Topbar() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur-md">
      <div>
        <h1 className="text-lg font-semibold text-slate-50">
          Echomedic – Risikoportal
        </h1>
        <p className="text-xs text-slate-400">
          Oversikt over risiko, tiltak og modenhet.
        </p>
      </div>

      {isLoggedIn && (
        <div className="flex items-center gap-4">
          <div className="text-right text-xs">
            <p className="font-medium text-slate-100">
              {user?.name ?? "Innlogget leder"}
            </p>
            <p className="text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Logg ut
          </button>
        </div>
      )}
    </header>
  );
}
