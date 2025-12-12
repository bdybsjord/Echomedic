import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ControlsTable from "../components/ControlsTable";
import { mockControls } from "../data/mockControls";
import type { ControlStatus } from "../types/control";
import { useControls } from "../hooks/useControls";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorBanner } from "../components/common/ErrorBanner";
import { useAuth } from "../context/useAuth";

export default function ControlsPage() {
  const { controls, loading, error } = useControls();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedFilter, setSelectedFilter] = useState<ControlStatus | "Alle">(
    "Alle",
  );

  const isReader = user?.role === "leser";

  // Bruker ekte Firestore-data hvis vi har noe, ellers mock
  const sourceControls = controls.length > 0 ? controls : mockControls;

  // Filtrerer kontroller basert på valgt filter
  const filteredControls = useMemo(() => {
    if (selectedFilter === "Alle") return sourceControls;
    return sourceControls.filter(
      (control) => control.status === selectedFilter,
    );
  }, [sourceControls, selectedFilter]);

  // Beregner statistikk basert på datakilden vi faktisk bruker
  const totalControls = sourceControls.length;
  const implementedControls = sourceControls.filter(
    (c) => c.status === "Implemented",
  ).length;
  const plannedControls = sourceControls.filter(
    (c) => c.status === "Planned",
  ).length;
  const notRelevantControls = sourceControls.filter(
    (c) => c.status === "NotRelevant",
  ).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-50">
            Sikkerhetskontroller (SoA)
          </h2>
          <p className="text-sm text-slate-400">
            Oversikt over implementeringsstatus for sikkerhetskontroller basert
            på ISO 27001.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex gap-3 text-xs">
            <div className="rounded-2xl bg-slate-900/80 px-4 py-2 border border-slate-800 flex flex-col">
              <span className="text-slate-400">Totalt antall kontroller</span>
              <span className="text-lg font-semibold text-slate-50">
                {totalControls}
              </span>
            </div>
            <div className="rounded-2xl bg-slate-900/80 px-4 py-2 border border-slate-800 flex flex-col">
              <span className="text-slate-400">Implementert</span>
              <span className="text-lg font-semibold text-emerald-400">
                {implementedControls}
              </span>
            </div>
            <div className="rounded-2xl bg-slate-900/80 px-4 py-2 border border-slate-800 flex flex-col">
              <span className="text-slate-400">Delvis</span>
              <span className="text-lg font-semibold text-amber-400">
                {plannedControls}
              </span>
            </div>
            <div className="rounded-2xl bg-slate-900/80 px-4 py-2 border border-slate-800 flex flex-col">
              <span className="text-slate-400">Ikke implementert</span>
              <span className="text-lg font-semibold text-slate-400">
                {notRelevantControls}
              </span>
            </div>
          </div>

          {!isReader && (
            <button
              type="button"
              onClick={() => navigate("/controls/new")}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-[0_0_24px_rgba(139,92,246,0.7)] hover:from-violet-400 hover:to-fuchsia-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Ny kontroll
            </button>
          )}
        </div>
      </header>

      {/* Filter-knapper */}
      <div
        className="flex gap-2 flex-wrap"
        role="group"
        aria-label="Filtrer kontrollstatus"
      >
        <button
          onClick={() => setSelectedFilter("Alle")}
          aria-pressed={selectedFilter === "Alle"}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
            selectedFilter === "Alle"
              ? "bg-slate-900 text-slate-50 border-slate-700 shadow-inner"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-900/80 hover:text-slate-300"
          }`}
        >
          Alle
        </button>
        <button
          onClick={() => setSelectedFilter("Implemented")}
          aria-pressed={selectedFilter === "Implemented"}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
            selectedFilter === "Implemented"
              ? "bg-emerald-950/60 text-emerald-400 border-emerald-800 shadow-inner"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-900/80 hover:text-slate-300"
          }`}
        >
          Implementert
        </button>
        <button
          onClick={() => setSelectedFilter("Planned")}
          aria-pressed={selectedFilter === "Planned"}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
            selectedFilter === "Planned"
              ? "bg-amber-950/60 text-amber-400 border-amber-800 shadow-inner"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-900/80 hover:text-slate-300"
          }`}
        >
          Delvis
        </button>
        <button
          onClick={() => setSelectedFilter("NotRelevant")}
          aria-pressed={selectedFilter === "NotRelevant"}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
            selectedFilter === "NotRelevant"
              ? "bg-slate-950/60 text-slate-400 border-slate-800 shadow-inner"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-900/80 hover:text-slate-300"
          }`}
        >
          Ikke implementert
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorBanner message={error} />}

      {!loading && !error && <ControlsTable controls={filteredControls} />}
    </div>
  );
}
