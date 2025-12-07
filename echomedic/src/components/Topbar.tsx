import { useAuth } from "../context/useAuth";

export default function Topbar() {
  const { isLoggedIn, user, logout } = useAuth();

  const displayName = user?.displayName || "Leder Echomedic";
  const email = user?.email || "leder@echomedic.no";
  const initial =
    (user?.displayName?.trim().charAt(0) ||
      user?.email?.trim().charAt(0) ||
      "E"
    ).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 py-3 backdrop-blur-xl">
      {/* Venstre: produkt / side-info */}
      <div>
        {/* Trenger vi noe her? */}
      </div>

      {/* Høyre: bruker / logout */}
      {isLoggedIn && (
        <div className="flex items-center gap-4">
          <div className="hidden text-right text-xs sm:block">
            <p className="font-medium text-slate-100">{displayName}</p>
            <p className="text-slate-400">{email}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Avatar-pill */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-semibold text-slate-950 shadow-[0_0_16px_rgba(139,92,246,0.9)]">
              {initial}
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center rounded-full border border-violet-500/60 bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-violet-50 shadow-[0_0_18px_rgba(15,23,42,0.9)] hover:bg-violet-600/20 hover:border-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Logg ut
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
