import { Link } from "react-router-dom";
import { useRisks } from "../hooks/useRisks";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorBanner } from "../components/common/ErrorBanner";
import RiskTable from "../components/RiskTable";
import { mockRisks } from "../data/mockRisks";
import { mapMockRisksToDomain } from "../adapters/mockRiskAdapter";
import type { Risk } from "../types/risk";
import { useAuth } from "../context/useAuth";

export const RisksPage = () => {
  const { risks, loading, error } = useRisks();
  const { user } = useAuth();

  const isReader = user?.role === "leser";

  const displayRisks: Risk[] =
    risks.length > 0 ? risks : mapMockRisksToDomain(mockRisks);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">
            Risikoregister
          </h1>
          <p className="text-xs text-slate-400">
            Full oversikt over registrerte risikoer i Echomedic.
          </p>
        </div>

        {!isReader && (
          <Link
            to="/risks/new"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-[0_0_24px_rgba(139,92,246,0.7)] hover:from-violet-400 hover:to-fuchsia-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Ny risiko
          </Link>
        )}
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorBanner message={error} />}
      {!loading && !error && <RiskTable risks={displayRisks} />}
    </div>
  );
};
