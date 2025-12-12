import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchRiskById, deleteRisk } from "../services/riskService";
import type { Risk } from "../types/risk";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorBanner } from "../components/common/ErrorBanner";
import RiskLevelBadge from "../components/RiskLevelBadge";
import RiskStatusBadge from "../components/RiskStatusBadge";
import { mockRisks } from "../data/mockRisks";
import { mapMockRiskToDomain } from "../adapters/mockRiskAdapter";
import { useAuth } from "../context/useAuth";

export const RiskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [risk, setRisk] = useState<Risk | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const isReader = user?.role === "leser";
  const canManage = !!user && !isReader;

  // Brukes for å unngå at vi prøver å slette mock-data
  const isMockRisk = id ? mockRisks.some((m) => m.id === id) : false;

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const r = await fetchRiskById(id);

        if (r) {
          setRisk(r);
        } else {
          const mock = mockRisks.find((m) => m.id === id);
          if (mock) setRisk(mapMockRiskToDomain(mock));
          else setError("Fant ikke risiko");
        }
      } catch {
        setError("Kunne ikke hente risiko");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const handleDelete = async () => {
    if (!risk || !user || isMockRisk) return;

    const confirmed = window.confirm(
      "Er du sikker på at du vil slette denne risikoen? Dette kan ikke angres.",
    );
    if (!confirmed) return;

    try {
      await deleteRisk(risk.id, user);
      navigate("/risks");
    } catch (err) {
      console.error(err);
      setError("Kunne ikke slette risiko.");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message={error} />;
  if (!risk) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-slate-500">{risk.id}</p>
          <h1 className="text-xl font-semibold text-slate-50">
            {risk.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/risks"
            className="text-sm font-medium text-violet-300 hover:text-violet-200"
          >
            ← Tilbake til register
          </Link>

          {canManage && !isMockRisk && (
            <>
              {/* Edit-side: /risks/:id/edit */}
              <button
                type="button"
                onClick={() => navigate(`/risks/${risk.id}/edit`)}
                className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900"
              >
                Rediger
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full border border-rose-500/70 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-500/20"
              >
                Slett
              </button>
            </>
          )}

          {isMockRisk && (
            <p className="text-[10px] text-slate-500">
              Demo-risiko (mock) – kan ikke slettes.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="glass-panel rounded-2xl p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-100">
            Risiko-informasjon
          </h2>

          <dl className="space-y-2 text-sm text-slate-200">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-400">Status</dt>
              <dd>
                <RiskStatusBadge status={risk.status} />
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-400">Eier</dt>
              <dd className="font-medium">{risk.owner}</dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-400">Score</dt>
              <dd className="flex items-center gap-2 font-mono">
                <span>{risk.score}</span>
                <RiskLevelBadge level={risk.level} />
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-400">Sannsynlighet</dt>
              <dd>{risk.likelihood} / 5</dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-400">Konsekvens</dt>
              <dd>{risk.consequence} / 5</dd>
            </div>

            <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
              <span>
                Opprettet: {risk.createdAt.toLocaleDateString("nb-NO")}
              </span>
              <span>
                Sist oppdatert: {risk.updatedAt.toLocaleDateString("nb-NO")}
              </span>
            </div>
          </dl>
        </section>

        <section className="glass-panel rounded-2xl p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-100">
            Tiltak
          </h2>
          <p className="text-sm text-slate-200">
            {risk.measures || "Ingen tiltak registrert ennå."}
          </p>
        </section>
      </div>

      <section className="glass-panel rounded-2xl p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-100">
          Beskrivelse
        </h2>
        <p className="text-sm text-slate-200">
          {risk.description || "Ingen beskrivelse registrert."}
        </p>
      </section>
    </div>
  );
};
