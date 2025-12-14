import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const base =
  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors";
const inactive =
  "text-slate-400 hover:bg-slate-900/70 hover:text-slate-50";
const active =
  "bg-slate-900/90 text-slate-50 shadow-[0_0_24px_rgba(15,23,42,0.7)] border border-violet-600/60";

export default function Sidebar() {
  const { isLoggedIn, user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <aside
      className="hidden md:flex w-72 flex-col border-r border-slate-800 bg-slate-950/95 px-5 py-6 backdrop-blur-2xl"
      aria-label="Hovednavigasjon for Echomedic risikoportal"
    >
      {/* LOGO / BRAND */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 shadow-inner">
            <img
              src="/echomedic-ikon.png"
              alt="Echomedic logo"
              className="h-8 w-8 object-contain"
              loading="eager"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-50">Echomedic</p>
            <p className="text-xs text-slate-400">
              Risikoportal · intern prototype
            </p>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="space-y-6 text-xs font-medium uppercase tracking-wide text-slate-500">
        {/* HOVED */}
        <div>
          <p className="mb-2 px-1 text-[11px]">Hovednavigasjon</p>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${base} ${isActive ? active : inactive}`
                }
              >
                <span className="h-5 w-1 rounded-full bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                <span className="h-2 w-2 rounded-full bg-emerald-400/90" />
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/risks"
                className={({ isActive }) =>
                  `${base} ${isActive ? active : inactive}`
                }
              >
                <span className="h-5 w-1 rounded-full bg-cyan-400/80 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                <span className="h-2 w-2 rounded-full bg-cyan-400/90" />
                <span>Risikoer</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* STYRING & KONTROLLER */}
        <div>
          <p className="mb-2 px-1 text-[11px]">Styring &amp; kontroller</p>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/controls"
                className={({ isActive }) =>
                  `${base} ${isActive ? active : inactive}`
                }
              >
                <span className="h-5 w-1 rounded-full bg-violet-500/80 shadow-[0_0_10px_rgba(139,92,246,0.9)]" />
                <span className="h-2 w-2 rounded-full bg-violet-400/90" />
                <span>Kontroller</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/policies"
                className={({ isActive }) =>
                  `${base} ${isActive ? active : inactive}`
                }
              >
                <span className="h-5 w-1 rounded-full bg-fuchsia-500/80 shadow-[0_0_10px_rgba(236,72,153,0.9)]" />
                <span className="h-2 w-2 rounded-full bg-fuchsia-400/90" />
                <span>Retningslinjer</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* ADMIN */}
        {isAdmin && (
          <div>
            <p className="mb-2 px-1 text-[11px]">Admin</p>
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/admin/audit-log"
                  className={({ isActive }) =>
                    `${base} ${isActive ? active : inactive}`
                  }
                >
                  <span className="h-5 w-1 rounded-full bg-amber-400/80 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/90" />
                  <span>Audit-logg</span>
                </NavLink>
              </li>
            </ul>
          </div>
        )}

        {/* TILGANG */}
        {!isLoggedIn && (
          <div>
            <p className="mb-2 px-1 text-[11px]">Tilgang</p>
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `${base} ${isActive ? active : inactive}`
                  }
                >
                  <span className="h-5 w-1 rounded-full bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.9)]" />
                  <span className="h-2 w-2 rounded-full bg-rose-400/90" />
                  <span>Logg inn</span>
                </NavLink>
              </li>
            </ul>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-auto pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
          <p>Echomedic · Security &amp; Risk</p>
          <p className="text-slate-600">
            Sprint&nbsp;2 · Firestore · Dashboard · Risiko-detaljer
          </p>
        </div>
      </nav>
    </aside>
  );
}
