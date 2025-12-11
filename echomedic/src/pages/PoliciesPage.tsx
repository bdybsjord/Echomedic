import { useState, useMemo } from "react";
import PoliciesTable from "../components/PoliciesTable";
import { mockPolicies, type PolicyStatus } from "../data/mockPolicies";

// Policies-siden - viser oversikt over alle sikkerhetspolicyer
// Sortert etter endret dato (nyeste først)
export default function PoliciesPage() {
  const [selectedFilter, setSelectedFilter] = useState<PolicyStatus | "Alle">("Alle");

  // Filtrerer policyer basert på valgt filter
  const filteredPolicies = useMemo(() => {
    const filtered =
      selectedFilter === "Alle"
        ? mockPolicies
        : mockPolicies.filter((policy) => policy.status === selectedFilter);
    
    // Sorter etter endret dato (nyeste først)
    return [...filtered].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }, [selectedFilter]);

  // Beregner statistikk
  const totalPolicies = mockPolicies.length;
  const validPolicies = mockPolicies.filter((p) => p.status === "Gyldig").length;
  const underRevision = mockPolicies.filter((p) => p.status === "Under revisjon").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-50">
            Sikkerhetspolicyer
          </h2>
          <p className="text-sm text-slate-400">
            Oversikt over alle sikkerhetspolicyer, versjoner og status (mock-data i Sprint 1).
          </p>
        </div>

        <div className="flex gap-3 text-xs">
          <div className="rounded-2xl bg-slate-900/80 px-4 py-2 border border-slate-800 flex flex-col">
            <span className="text-slate-400">Totalt antall policyer</span>
            <span className="text-lg font-semibold text-slate-50">{totalPolicies}</span>
          </div>
          <div className="rounded-2xl bg-slate-900/80 px-4 py-2 border border-slate-800 flex flex-col">
            <span className="text-slate-400">Gyldig</span>
            <span className="text-lg font-semibold text-emerald-400">{validPolicies}</span>
          </div>
          <div className="rounded-2xl bg-slate-900/80 px-4 py-2 border border-slate-800 flex flex-col">
            <span className="text-slate-400">Under revisjon</span>
            <span className="text-lg font-semibold text-amber-400">{underRevision}</span>
          </div>
        </div>
      </header>

      {/* Filter-knapper */}
      <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrer policystatus">
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
          onClick={() => setSelectedFilter("Gyldig")}
          aria-pressed={selectedFilter === "Gyldig"}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
            selectedFilter === "Gyldig"
              ? "bg-emerald-950/60 text-emerald-400 border-emerald-800 shadow-inner"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-900/80 hover:text-slate-300"
          }`}
        >
          Gyldig
        </button>
        <button
          onClick={() => setSelectedFilter("Under revisjon")}
          aria-pressed={selectedFilter === "Under revisjon"}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
            selectedFilter === "Under revisjon"
              ? "bg-amber-950/60 text-amber-400 border-amber-800 shadow-inner"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-900/80 hover:text-slate-300"
          }`}
        >
          Under revisjon
        </button>
      </div>

      {/* PoliciesTable komponenten viser filtrerte og sorterte policyer */}
      <PoliciesTable policies={filteredPolicies} />
    </div>
  );
}

