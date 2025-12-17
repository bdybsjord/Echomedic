import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";

const base =
  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors";
const inactive =
  "text-slate-400 hover:bg-slate-900/70 hover:text-slate-50";
const active =
  "bg-slate-900/90 text-slate-50 shadow-[0_0_24px_rgba(15,23,42,0.7)] border border-violet-600/60";

export default function Sidebar() {
  const { isLoggedIn, user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Tablet: sidebar som drawer (md), Desktop: alltid synlig (lg)
  const [open, setOpen] = useState(false);

  // Lukk med ESC når den er åpen på tablet
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {/* Tablet toggle (md) - skjult på desktop (lg) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex lg:hidden fixed left-4 top-4 z-50 items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/90 px-3 py-2 text-xs font-medium text-slate-200 backdrop-blur-2xl shadow-[0_0_24px_rgba(0,0,0,0.35)] hover:bg-slate-900/80"
        aria-label="Åpne navigasjon"
      >
        <span className="inline-block h-4 w-4">
          {/* hamburger */}
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        Meny
      </button>

      {/* Overlay for tablet drawer */}
      {open && (
        <div
          className="hidden md:block lg:hidden fixed inset-0 z-40 bg-black/45"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          // base layout
          "fixed z-50 h-dvh w-72 flex-col border-r border-slate-800 bg-slate-950/95 px-5 py-6 backdrop-blur-2xl",
          // mobil: skjult
          "hidden",
          // tablet+: finnes
          "md:flex",
          // desktop: alltid synlig
          "lg:translate-x-0 lg:static lg:z-auto lg:h-screen",
          // tablet: drawer animasjon
          "md:transition-transform md:duration-200",
          open ? "md:translate-x-0" : "md:-translate-x-full lg:translate-x-0",
        ].join(" ")}
        aria-label="Hovednavigasjon for Echomedic risikoportal"
      >
        {/* Close button*/}
        <div className="lg:hidden mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-xs text-slate-200 hover:bg-slate-900/80"
            aria-label="Lukk navigasjon"
          >
            Lukk
          </button>
        </div>

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
                  onClick={() => setOpen(false)}
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
                  onClick={() => setOpen(false)}
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
                  onClick={() => setOpen(false)}
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
                  onClick={() => setOpen(false)}
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
                    onClick={() => setOpen(false)}
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
                    onClick={() => setOpen(false)}
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
          </div>
        </nav>
      </aside>
    </>
  );
}
