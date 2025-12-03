import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const navLinkBase =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors";
const navLinkInactive =
  "text-slate-400 hover:bg-slate-800/80 hover:text-white";
const navLinkActive = "bg-slate-900 text-slate-50 shadow-inner";

export default function Sidebar() {
  const { isLoggedIn } = useAuth();

  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-slate-800 bg-slate-950/90 px-5 py-6 backdrop-blur-xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-950 font-bold">
            E
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-50">Echomedic</p>
            <p className="text-xs text-slate-400">Security &amp; Risk Portal</p>
          </div>
        </div>
      </div>

      <nav className="space-y-6 text-xs font-medium uppercase tracking-wide text-slate-500">
        <div>
          <p className="mb-2 px-1">Hovednavigasjon</p>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${navLinkBase} ${
                    isActive ? navLinkActive : navLinkInactive
                  }`
                }
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span>Dashboard</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {!isLoggedIn && (
          <div>
            <p className="mb-2 px-1">Tilgang</p>
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `${navLinkBase} ${
                      isActive ? navLinkActive : navLinkInactive
                    }`
                  }
                >
                  <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]" />
                  <span>Logg inn</span>
                </NavLink>
              </li>
            </ul>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
          <p>Echomedic – intern prototype</p>
          <p className="text-slate-600">
            Sprint 1 · Pålogging &amp; risikoliste (UI)
          </p>
        </div>
      </nav>
    </aside>
  );
}
