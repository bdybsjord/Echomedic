import { useMemo, useState } from "react";
import PoliciesTable from "../components/PoliciesTable";
import { mockPolicies } from "../data/mockPolicies";
import type { PolicyStatus } from "../types/policy";
import { usePolicies } from "../hooks/usePolicies";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorBanner } from "../components/common/ErrorBanner";

// Policies-siden - viser oversikt over alle sikkerhetspolicyer
// Sortert etter endret dato (nyeste først)
// Radene i PoliciesTable linker videre til detaljsiden (/policies/:id)
export default function PoliciesPage() {
  const { policies, loading, error } = usePolicies();
  const [selectedFilter, setSelectedFilter] = useState<PolicyStatus | "Alle">(
    "Alle",
  );

  // Bruk Firestore-data hvis vi har det, ellers mock
  const sourcePolicies = policies.length > 0 ? policies : mockPolicies;

  // Filtrerer policyer basert på valgt filter + sorterer på updatedAt (nyeste først)
  const filteredPolicies = useMemo(() => {
    const filtered =
      selectedFilter === "Alle"
        ? sourcePolicies
        : sourcePolicies.filter((policy) => policy.status === selectedFilter);

    return [...filtered].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
    );
  }, [selectedFilter, sourcePolicies]);

  // Beregner statistikk
  const totalPolicies = sourcePolicies.length;
  const validPolicies = sourcePolicies.filter(
    (p) => p.status === "Gyldig",
  ).length;
  const underRevision = sourcePolicies.filter(
    (p) => p.status === "Under revisjon",
  ).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-50">
            Sikkerhetspolicyer
          </h2>
          <p className="text-sm text-slate-400">
            Oversikt over alle sikkerhetspolicyer, versjoner og status. Klikk
            på en policy for å se detaljert innhold.
          </p>
        </div>

        <div className="flex gap-3 text-xs">
          <div className="rounded-2xl bg-slate-900/80 px-4 py-2 border border-slate-800 flex flex-col">
            <span className="text-slate-400">Totalt antall policyer</span>
            <span className="text-lg font-semibold text-slate-50">
              {totalPolicies}
            </span>
          </div>
          <div className="rounded-2xl bg-slate-900/80 px-4 py-2 border border-slate-800 flex flex-col">
            <span className="text-slate-400">Gyldig</span>
            <span className="text-lg font-semibold text-emerald-400">
              {validPolicies}
            </span>
          </div>
          <div className="rounded-2xl bg-slate-900/80 px-4 py-2 border border-slate-800 flex flex-col">
            <span className="text-slate-400">Under revisjon</span>
            <span className="text-lg font-semibold text-amber-400">
              {underRevision}
            </span>
          </div>
        </div>
      </header>

      {/* Filter-knapper */}
      <div
        className="flex gap-2 flex-wrap"
        role="group"
        aria-label="Filtrer policystatus"
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

      {loading && <LoadingSpinner />}
      {error && <ErrorBanner message={error} />}

      {!loading && !error && <PoliciesTable policies={filteredPolicies} />}
    </div>
  );
}
