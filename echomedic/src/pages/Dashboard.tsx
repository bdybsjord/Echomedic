import { useState } from "react";
import RiskTable from "../components/RiskTable";
import { mockRisks, type RiskLevel } from "../data/mockRisks";

// Dashboard-siden - hovedside for risikodashboard
// Viser oversikt over alle risikoer i en tabell
export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState<RiskLevel | "All">("All");

  // Filtrerer risikoer basert på valgt filter
  const filteredRisks =
    selectedFilter === "All"
      ? mockRisks
      : mockRisks.filter((risk) => risk.level === selectedFilter);

  // Beregner statistikk
  const totalRisks = mockRisks.length;
  const highRisks = mockRisks.filter((r) => r.level === "High").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-50">
            Risiko-oversikt
          </h2>
          <p className="text-sm text-slate-400">
            Her vil du finne risikoregister, status på tiltak og modenhet
            (mock-data i Sprint 1).
          </p>
        </div>

        <div className="flex gap-3 text-xs">
          <div className="rounded-2xl bg-slate-900/80 px-4 py-2 border border-slate-800 flex flex-col">
            <span className="text-slate-400">Antall registrerte risikoer</span>
            <span className="text-lg font-semibold text-slate-50">{totalRisks}</span>
          </div>
          <div className="rounded-2xl bg-slate-900/80 px-4 py-2 border border-slate-800 flex flex-col">
            <span className="text-slate-400">Kritiske (rød)</span>
            <span className="text-lg font-semibold text-rose-400">{highRisks}</span>
          </div>
        </div>
      </header>

      {/* Filter-knapper */}
      <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrer risikonivå">
        <button
          onClick={() => setSelectedFilter("All")}
          aria-pressed={selectedFilter === "All"}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
            selectedFilter === "All"
              ? "bg-slate-900 text-slate-50 border-slate-700 shadow-inner"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-900/80 hover:text-slate-300"
          }`}
        >
          Alle
        </button>
        <button
          onClick={() => setSelectedFilter("High")}
          aria-pressed={selectedFilter === "High"}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
            selectedFilter === "High"
              ? "bg-rose-950/60 text-rose-400 border-rose-800 shadow-inner"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-900/80 hover:text-slate-300"
          }`}
        >
          Høy
        </button>
        <button
          onClick={() => setSelectedFilter("Medium")}
          aria-pressed={selectedFilter === "Medium"}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
            selectedFilter === "Medium"
              ? "bg-amber-950/60 text-amber-400 border-amber-800 shadow-inner"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-900/80 hover:text-slate-300"
          }`}
        >
          Middels
        </button>
        <button
          onClick={() => setSelectedFilter("Low")}
          aria-pressed={selectedFilter === "Low"}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
            selectedFilter === "Low"
              ? "bg-emerald-950/60 text-emerald-400 border-emerald-800 shadow-inner"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-900/80 hover:text-slate-300"
          }`}
        >
          Lav
        </button>
      </div>

      {/* RiskTable komponenten viser filtrerte risikoer */}
      <RiskTable risks={filteredRisks} />
    </div>
  );
}